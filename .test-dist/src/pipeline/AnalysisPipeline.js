import * as fs from "fs/promises";
import { performance } from "perf_hooks";
import { WorkspaceScanner } from "../scanner/WorkspaceScanner";
import { JavaParser } from "../parser/JavaParser";
import { SemanticExtractor } from "../parser/SemanticExtractor";
import { ArchitectureGraph } from "../engine/ArchitectureGraph";
import { ComponentTypeResolver } from "../engine/ComponentTypeResolver";
/**
 * AnalysisPipeline orchestrates the static analysis workflow, scanning files,
 * parsing ASTs, extracting components, and constructing the dependency graph.
 */
export class AnalysisPipeline {
    constructor(logger, basePath) {
        this.logger = logger;
        this.basePath = basePath;
    }
    /**
     * Runs the complete static analysis pipeline and returns the constructed ArchitectureGraph along with timing metrics.
     */
    async run() {
        this.logger.info("Scanning workspace...");
        const scanStart = performance.now();
        const scanner = new WorkspaceScanner(this.basePath);
        const filePaths = await scanner.scan();
        const workspaceScanTime = performance.now() - scanStart;
        this.logger.info(`${filePaths.length} Java files found`);
        this.logger.info("Parsing Java files...");
        const parser = new JavaParser();
        const extractor = new SemanticExtractor();
        const graph = new ArchitectureGraph();
        const classes = [];
        let parsedCount = 0;
        let extractedCount = 0;
        let parserTime = 0;
        let semanticExtractionTime = 0;
        for (const filePath of filePaths) {
            try {
                const sourceCode = await fs.readFile(filePath, "utf8");
                const pStart = performance.now();
                const ast = parser.parse(sourceCode);
                parserTime += performance.now() - pStart;
                parsedCount++;
                const eStart = performance.now();
                const javaClass = extractor.extract(ast, filePath);
                semanticExtractionTime += performance.now() - eStart;
                classes.push(javaClass);
                graph.addComponent(javaClass);
                extractedCount++;
            }
            catch (e) {
                this.logger.warn(`Failed to process ${filePath}: ${e instanceof Error ? e.message : e}`);
            }
        }
        this.logger.info(`${parsedCount} ASTs created`);
        this.logger.info("Extracting semantic model...");
        this.logger.info(`${extractedCount} JavaClass objects extracted`);
        this.logger.info("Resolving component types through inheritance...");
        const resolver = new ComponentTypeResolver();
        resolver.resolve(classes);
        this.logger.info("Building architecture graph...");
        const graphBuildStart = performance.now();
        let relationshipsCount = 0;
        for (const javaClass of classes) {
            for (const depRef of javaClass.dependencies) {
                const resolvedFqName = this.resolveDependencyFqName(javaClass, depRef.className, classes);
                if (resolvedFqName) {
                    graph.connect(javaClass.fullyQualifiedName, resolvedFqName, depRef.relationshipType);
                    relationshipsCount++;
                }
            }
        }
        const graphBuildTime = performance.now() - graphBuildStart;
        this.logger.info("Graph contains:");
        this.logger.info(`    Components: ${classes.length}`);
        this.logger.info(`    Relationships: ${relationshipsCount}`);
        return {
            graph,
            workspaceScanTime,
            parserTime,
            semanticExtractionTime,
            graphBuildTime,
            javaFiles: filePaths.length,
        };
    }
    resolveDependencyFqName(sourceClass, depSimpleName, allClassList) {
        const explicitImport = sourceClass.imports.find((imp) => imp.endsWith(`.${depSimpleName}`));
        if (explicitImport) {
            return explicitImport;
        }
        const samePackageFqName = sourceClass.packageName ? `${sourceClass.packageName}.${depSimpleName}` : depSimpleName;
        const existsInSamePackage = allClassList.some((c) => c.fullyQualifiedName === samePackageFqName);
        if (existsInSamePackage) {
            return samePackageFqName;
        }
        const matchingClass = allClassList.find((c) => c.className === depSimpleName);
        if (matchingClass) {
            return matchingClass.fullyQualifiedName;
        }
        return null;
    }
}
