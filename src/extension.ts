import * as vscode from "vscode";
import { CodeAtlasTreeProvider } from "./ui/sidebarTree";
import { AnalyzeProjectCommand } from "./commands/AnalyzeProjectCommand";
import { DiagnosticPublisher } from "./diagnostics/DiagnosticPublisher";
import { ArchitectureExplorerPanel } from "./explorer/ArchitectureExplorerPanel";

let outputChannel: vscode.OutputChannel;
let diagnosticPublisher: DiagnosticPublisher;

export function activate(context: vscode.ExtensionContext): void {
  outputChannel = vscode.window.createOutputChannel("CodeAtlas");
  context.subscriptions.push(outputChannel);

  diagnosticPublisher = new DiagnosticPublisher();
  context.subscriptions.push(diagnosticPublisher);

  const treeProvider = new CodeAtlasTreeProvider();
  vscode.window.registerTreeDataProvider("codeatlasView", treeProvider);

  const analyzeCommand = vscode.commands.registerCommand("codeatlas.analyze", async () => {
    const command = new AnalyzeProjectCommand(outputChannel, diagnosticPublisher, treeProvider);
    await command.execute();
  });

  const openExplorerCommand = vscode.commands.registerCommand("codeatlas.openExplorer", async () => {
    // If no analysis has run yet, trigger it automatically first
    if (!AnalyzeProjectCommand.lastGraph) {
      const command = new AnalyzeProjectCommand(outputChannel, diagnosticPublisher, treeProvider);
      await command.execute();
    }

    if (AnalyzeProjectCommand.lastGraph) {
      ArchitectureExplorerPanel.createOrShow(
        context.extensionUri,
        AnalyzeProjectCommand.lastGraph,
        AnalyzeProjectCommand.lastViolations,
      );
    } else {
      vscode.window.showErrorMessage("Failed to run analysis. Cannot open Architecture Explorer.");
    }
  });

  const selectNodeCommand = vscode.commands.registerCommand("codeatlas.selectNode", (nodeId: string) => {
    if (!ArchitectureExplorerPanel.currentPanel && AnalyzeProjectCommand.lastGraph) {
      ArchitectureExplorerPanel.createOrShow(
        context.extensionUri,
        AnalyzeProjectCommand.lastGraph,
        AnalyzeProjectCommand.lastViolations,
      );
    }
    ArchitectureExplorerPanel.currentPanel?.selectNode(nodeId);
  });

  context.subscriptions.push(analyzeCommand);
  context.subscriptions.push(openExplorerCommand);
  context.subscriptions.push(selectNodeCommand);
}

export function deactivate(): void {}
