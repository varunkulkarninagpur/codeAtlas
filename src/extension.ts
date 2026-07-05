import * as vscode from "vscode";
import { CodeAtlasTreeProvider } from "./ui/sidebarTree";

export function activate(context: vscode.ExtensionContext): void {
  const treeProvider = new CodeAtlasTreeProvider();
  vscode.window.registerTreeDataProvider("codeatlasView", treeProvider);

  const analyzeCommand = vscode.commands.registerCommand("codeatlas.analyze", () => {
    vscode.window.showInformationMessage("CodeAtlas initialized successfully.");
  });

  context.subscriptions.push(analyzeCommand);
}

export function deactivate(): void {
  // Clean up references if needed
}
