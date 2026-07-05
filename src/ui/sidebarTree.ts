// TODO: CodeAtlas Sidebar Tree view provider

import * as vscode from "vscode";

export class CodeAtlasTreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined | null | void> = new vscode.EventEmitter<vscode.TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  public refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
    if (element) {
      return Promise.resolve([]);
    }
    // TODO: Display health score, components breakdown, and violations list
    return Promise.resolve([
      new vscode.TreeItem("CodeAtlas: Ready to Analyze", vscode.TreeItemCollapsibleState.None)
    ]);
  }
}
