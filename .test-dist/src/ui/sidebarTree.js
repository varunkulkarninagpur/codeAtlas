import * as vscode from "vscode";
export class CodeAtlasTreeProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.state = null;
    }
    /**
     * Updates the dashboard state and refreshes the tree view.
     * @param state The new dashboard state.
     */
    updateState(state) {
        this.state = state;
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!this.state) {
            return Promise.resolve([
                new DashboardItem("CodeAtlas: Ready to Analyze", "Run 'Analyze Project' to begin", vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("play"), {
                    command: "codeatlas.analyze",
                    title: "Analyze Project",
                }),
            ]);
        }
        if (!element) {
            // Top-level categories
            const items = [
                new DashboardItem(`Architecture Health: ${this.state.healthScore}/100`, `Rating: ${this.state.rating}`, vscode.TreeItemCollapsibleState.None, this.getHealthIcon(this.state.healthScore)),
                new DashboardItem("Score Breakdown", "", vscode.TreeItemCollapsibleState.Collapsed, new vscode.ThemeIcon("info")),
                new DashboardItem("Components", `Total: ${this.state.nodes}`, vscode.TreeItemCollapsibleState.Expanded, new vscode.ThemeIcon("package")),
                new DashboardItem(`Violations (${this.state.errors + this.state.warnings})`, "", vscode.TreeItemCollapsibleState.Collapsed, new vscode.ThemeIcon("warning")),
                new DashboardItem("Graph Statistics", "", vscode.TreeItemCollapsibleState.Collapsed, new vscode.ThemeIcon("graph-line")),
            ];
            if (this.state.metrics) {
                items.push(new DashboardItem("Developer", `Total: ${this.state.metrics.totalAnalysisTime.toFixed(1)}ms`, vscode.TreeItemCollapsibleState.Collapsed, new vscode.ThemeIcon("dashboard")));
            }
            items.push(new DashboardItem(`Last Analysis: ${this.state.lastAnalysisTimestamp}`, "", vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("clock")), new DashboardItem("Actions", "", vscode.TreeItemCollapsibleState.Expanded, new vscode.ThemeIcon("run-all")));
            return Promise.resolve(items);
        }
        // Children of categories
        if (element.label === "Score Breakdown" && this.state) {
            const bypass = this.state.bypassCount ?? 0;
            const circular = this.state.circularCount ?? 0;
            const unused = this.state.unusedCount ?? 0;
            const totalDeductions = (bypass * 10) + (circular * 15) + (unused * 5);
            return Promise.resolve([
                new DashboardItem("Base Score: 100", "", vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("add")),
                new DashboardItem(`Layer Violations: -${bypass * 10}`, `${bypass} issues`, vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("remove")),
                new DashboardItem(`Circular Dependencies: -${circular * 15}`, `${circular} issues`, vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("remove")),
                new DashboardItem(`Unused Services: -${unused * 5}`, `${unused} issues`, vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("remove")),
                new DashboardItem(`Total Deductions: -${totalDeductions}`, "", vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("feedback")),
                new DashboardItem(`Final Score: ${this.state.healthScore}/100`, "", vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("pass")),
            ]);
        }
        if (element.label === "Components") {
            return Promise.resolve([
                new DashboardItem(`Controllers: ${this.state.controllers}`, "", vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("symbol-class")),
                new DashboardItem(`Services: ${this.state.services}`, "", vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("symbol-interface")),
                new DashboardItem(`Repositories: ${this.state.repositories}`, "", vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("database")),
                new DashboardItem(`Entities: ${this.state.entities}`, "", vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("symbol-variable")),
            ]);
        }
        if (element.label.startsWith("Violations") && this.state) {
            const violations = this.state.violationsList ?? [];
            const bypassList = violations.filter(v => v.type === "BYPASS_SERVICE");
            const circularList = violations.filter(v => v.type === "CIRCULAR_DEPENDENCY");
            const unusedList = violations.filter(v => v.type === "UNUSED_SERVICE");
            return Promise.resolve([
                new DashboardItem(`Layer Violations (${bypassList.length})`, "", vscode.TreeItemCollapsibleState.Collapsed, new vscode.ThemeIcon("error")),
                new DashboardItem(`Circular Dependencies (${circularList.length})`, "", vscode.TreeItemCollapsibleState.Collapsed, new vscode.ThemeIcon("error")),
                new DashboardItem(`Unused Services (${unusedList.length})`, "", vscode.TreeItemCollapsibleState.Collapsed, new vscode.ThemeIcon("warning")),
            ]);
        }
        if (element.label.startsWith("Layer Violations") && this.state) {
            const violations = this.state.violationsList ?? [];
            const bypassList = violations.filter(v => v.type === "BYPASS_SERVICE");
            const items = bypassList.map(v => {
                const targetNode = v.affectedNodes[0];
                const name = targetNode.split(".").pop();
                return new DashboardItem(name, v.message, vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("symbol-class"), {
                    command: "codeatlas.selectNode",
                    title: "Select Node",
                    arguments: [targetNode]
                });
            });
            return Promise.resolve(items);
        }
        if (element.label.startsWith("Circular Dependencies") && this.state) {
            const violations = this.state.violationsList ?? [];
            const circularList = violations.filter(v => v.type === "CIRCULAR_DEPENDENCY");
            const items = circularList.map(v => {
                const targetNode = v.affectedNodes[0];
                const name = targetNode.split(".").pop();
                return new DashboardItem(name, v.message, vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("symbol-class"), {
                    command: "codeatlas.selectNode",
                    title: "Select Node",
                    arguments: [targetNode]
                });
            });
            return Promise.resolve(items);
        }
        if (element.label.startsWith("Unused Services") && this.state) {
            const violations = this.state.violationsList ?? [];
            const unusedList = violations.filter(v => v.type === "UNUSED_SERVICE");
            const items = unusedList.map(v => {
                const targetNode = v.affectedNodes[0];
                const name = targetNode.split(".").pop();
                return new DashboardItem(name, v.message, vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("symbol-class"), {
                    command: "codeatlas.selectNode",
                    title: "Select Node",
                    arguments: [targetNode]
                });
            });
            return Promise.resolve(items);
        }
        if (element.label === "Graph Statistics") {
            return Promise.resolve([
                new DashboardItem(`Nodes: ${this.state.nodes}`, "", vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("circle-outline")),
                new DashboardItem(`Relationships: ${this.state.relationships}`, "", vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("git-compare")),
            ]);
        }
        if (element.label === "Developer" && this.state.metrics) {
            const m = this.state.metrics;
            return Promise.resolve([
                new DashboardItem(`Workspace Scan: ${m.workspaceScanTime.toFixed(1)}ms`, "", vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("search")),
                new DashboardItem(`Parser Time: ${m.parserTime.toFixed(1)}ms`, "", vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("code")),
                new DashboardItem(`Semantic Extraction: ${m.semanticExtractionTime.toFixed(1)}ms`, "", vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("symbol-method")),
                new DashboardItem(`Graph Build: ${m.graphBuildTime.toFixed(1)}ms`, "", vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("git-branch")),
                new DashboardItem(`Rule Evaluation: ${m.ruleEvaluationTime.toFixed(1)}ms`, "", vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("play")),
                new DashboardItem(`Total Analysis Time: ${m.totalAnalysisTime.toFixed(1)}ms`, "", vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("zap")),
            ]);
        }
        if (element.label === "Actions") {
            return Promise.resolve([
                new DashboardItem("Analyze Project", "Scan and validate workspace", vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("refresh"), {
                    command: "codeatlas.analyze",
                    title: "Analyze Project",
                }),
                new DashboardItem("Open Architecture Graph", "Open Explorer View", vscode.TreeItemCollapsibleState.None, new vscode.ThemeIcon("graph"), {
                    command: "codeatlas.openExplorer",
                    title: "Open Architecture Explorer",
                }),
            ]);
        }
        return Promise.resolve([]);
    }
    getHealthIcon(score) {
        if (score >= 90) {
            return new vscode.ThemeIcon("pass", new vscode.ThemeColor("testing.iconPassed"));
        }
        if (score >= 75) {
            return new vscode.ThemeIcon("info", new vscode.ThemeColor("problems.infoIconForeground"));
        }
        return new vscode.ThemeIcon("error", new vscode.ThemeColor("testing.iconFailed"));
    }
}
class DashboardItem extends vscode.TreeItem {
    constructor(label, descriptionValue, collapsibleState, iconPath, command) {
        super(label, collapsibleState);
        this.label = label;
        this.descriptionValue = descriptionValue;
        this.collapsibleState = collapsibleState;
        this.description = descriptionValue;
        if (iconPath) {
            this.iconPath = iconPath;
        }
        if (command) {
            this.command = command;
        }
    }
}
