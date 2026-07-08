import * as vscode from "vscode";
import { performance } from "perf_hooks";
import { AnalysisPipeline, PipelineLogger } from "../pipeline/AnalysisPipeline";
import { ArchitectureGraph } from "../engine/ArchitectureGraph";
import { ArchitectureEngine } from "../engine/ArchitectureEngine";
import { LayerViolationRule } from "../engine/rules/LayerViolationRule";
import { CircularDependencyRule } from "../engine/rules/CircularDependencyRule";
import { UnusedServiceRule } from "../engine/rules/UnusedServiceRule";
import { DiagnosticPublisher } from "../diagnostics/DiagnosticPublisher";
import { CodeAtlasTreeProvider, DashboardState } from "../ui/sidebarTree";
import { ArchitectureViolation } from "../common/types";

/**
 * Command handler for "CodeAtlas: Analyze Project" (codeatlas.analyze).
 */
export class AnalyzeProjectCommand {
  public static lastGraph: ArchitectureGraph | null = null;
  public static lastViolations: ArchitectureViolation[] = [];

  constructor(
    private outputChannel: vscode.OutputChannel,
    private diagnosticPublisher: DiagnosticPublisher,
    private treeProvider: CodeAtlasTreeProvider,
  ) {}

  /**
   * Executes the analysis pipeline and updates native VS Code problems panel and sidebar dashboard.
   */
  public async execute(): Promise<void> {
    this.outputChannel.show(true);

    const verbose = vscode.workspace.getConfiguration("codeatlas").get<boolean>("verboseLogging", false) ||
                    vscode.workspace.getConfiguration("codeAtlas").get<boolean>("verboseLogging", false);

    const logger: PipelineLogger = {
      info: (msg) => {
        if (verbose) {
          this.outputChannel.appendLine(`[INFO] ${msg}`);
        }
      },
      warn: (msg) => {
        if (verbose) {
          this.outputChannel.appendLine(`[WARN] ${msg}`);
        }
      },
      error: (msg) => {
        this.outputChannel.appendLine(`[ERROR] ${msg}`);
      },
    };

    try {
      const totalStart = performance.now();

      const pipeline = new AnalysisPipeline(logger);
      const result = await pipeline.run();
      const graph = result.graph;

      // Rule Evaluation Timing
      const ruleStart = performance.now();
      const engine = new ArchitectureEngine([
        new LayerViolationRule(),
        new CircularDependencyRule(),
        new UnusedServiceRule(),
      ]);
      const violations = engine.analyze(graph);
      const ruleEvaluationTime = performance.now() - ruleStart;

      const totalAnalysisTime = performance.now() - totalStart;

      // Cache result for explorer panel
      AnalyzeProjectCommand.lastGraph = graph;
      AnalyzeProjectCommand.lastViolations = violations;

      // Publish violations to Problems pane
      this.diagnosticPublisher.publish(violations);

      // Calculate state metrics for Dashboard Sidebar UI
      const components = graph.getAllComponents();
      const controllers = components.filter((c) => c.type === "CONTROLLER").length;
      const services = components.filter((c) => c.type === "SERVICE").length;
      const repositories = components.filter((c) => c.type === "REPOSITORY").length;
      const entities = components.filter((c) => c.type === "ENTITY").length;

      const errors = violations.filter((v) => v.severity === "ERROR").length;
      const warnings = violations.filter((v) => v.severity === "WARNING").length;

      let relationships = 0;
      for (const comp of components) {
        relationships += graph.getOutgoing(comp.fullyQualifiedName).length;
      }

      const scoreInfo = engine.calculateHealthScore(violations);
      const score = scoreInfo.score;
      let rating: DashboardState["rating"] = "Poor";
      if (score >= 90) {
        rating = "Excellent";
      } else if (score >= 80) {
        rating = "Good";
      } else if (score >= 60) {
        rating = "Fair";
      }

      const timestamp = new Date().toLocaleTimeString();

      const metrics = {
        workspaceScanTime: result.workspaceScanTime,
        parserTime: result.parserTime,
        semanticExtractionTime: result.semanticExtractionTime,
        graphBuildTime: result.graphBuildTime,
        ruleEvaluationTime,
        totalAnalysisTime,
        javaFiles: result.javaFiles,
        components: components.length,
        relationships,
        violations: violations.length,
        healthScore: score,
      };

      const bypassCount = violations.filter(v => v.type === "BYPASS_SERVICE").length;
      const circularCount = violations.filter(v => v.type === "CIRCULAR_DEPENDENCY").length;
      const unusedCount = violations.filter(v => v.type === "UNUSED_SERVICE").length;

      const dashboardState: DashboardState = {
        healthScore: score,
        rating,
        controllers,
        services,
        repositories,
        entities,
        errors,
        warnings,
        nodes: components.length,
        relationships,
        lastAnalysisTimestamp: timestamp,
        metrics,
        bypassCount,
        circularCount,
        unusedCount,
        violationsList: violations,
      };

      // Push state to update the Sidebar Tree View
      this.treeProvider.updateState(dashboardState);

      // Print redesigned Analysis Report
      this.outputChannel.appendLine("================================================");
      this.outputChannel.appendLine("CodeAtlas Analysis Complete");
      this.outputChannel.appendLine("");
      this.outputChannel.appendLine("Architecture Health");
      this.outputChannel.appendLine(`${score} / 100`);
      this.outputChannel.appendLine("");
      this.outputChannel.appendLine("Summary");
      this.outputChannel.appendLine(`Java Files:    ${result.javaFiles}`);
      this.outputChannel.appendLine(`Components:    ${components.length}`);
      this.outputChannel.appendLine(`Relationships: ${relationships}`);
      this.outputChannel.appendLine(`Analysis Time: ${totalAnalysisTime.toFixed(0)} ms`);
      this.outputChannel.appendLine("");
      this.outputChannel.appendLine(`${violations.length} Issues Found`);
      this.outputChannel.appendLine("");
      this.outputChannel.appendLine("Open the Problems panel for detailed diagnostics.");
      this.outputChannel.appendLine("================================================");

      if (verbose) {
        this.outputChannel.appendLine("\n[VERBOSE PERFORMANCE METRICS]");
        this.outputChannel.appendLine(`Workspace Scan Time:      ${result.workspaceScanTime.toFixed(2)} ms`);
        this.outputChannel.appendLine(`Parser Time:              ${result.parserTime.toFixed(2)} ms`);
        this.outputChannel.appendLine(`Semantic Extraction Time: ${result.semanticExtractionTime.toFixed(2)} ms`);
        this.outputChannel.appendLine(`Graph Build Time:         ${result.graphBuildTime.toFixed(2)} ms`);
        this.outputChannel.appendLine(`Rule Evaluation Time:     ${ruleEvaluationTime.toFixed(2)} ms`);
        this.outputChannel.appendLine(`Total Analysis Time:      ${totalAnalysisTime.toFixed(2)} ms`);
        this.outputChannel.appendLine("================================================\n");
      }

      logger.info("Analysis pipeline completed successfully.");
    } catch (error) {
      logger.error(`Pipeline failed: ${error instanceof Error ? error.message : error}`);
    }
  }
}
