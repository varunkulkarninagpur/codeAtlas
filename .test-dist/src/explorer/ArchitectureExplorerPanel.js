import * as vscode from "vscode";
import * as path from "path";
/**
 * Manages the Architecture Explorer WebviewPanel.
 */
export class ArchitectureExplorerPanel {
    static createOrShow(extensionUri, graph, violations) {
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
        if (ArchitectureExplorerPanel.currentPanel) {
            ArchitectureExplorerPanel.currentPanel.panel.reveal(column);
            ArchitectureExplorerPanel.currentPanel.updateData(graph, violations);
            return;
        }
        const panel = vscode.window.createWebviewPanel(ArchitectureExplorerPanel.viewType, "Architecture Explorer", column || vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file(path.join(extensionUri.fsPath, "dist")),
            ],
        });
        ArchitectureExplorerPanel.currentPanel = new ArchitectureExplorerPanel(panel, extensionUri, graph, violations);
    }
    constructor(panel, extensionUri, graph, violations) {
        this.disposables = [];
        this.panel = panel;
        this.extensionUri = extensionUri;
        this.panel.webview.html = this.getHtmlForWebview(this.panel.webview);
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
        this.panel.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case "openFile":
                    if (message.filePath) {
                        const uri = vscode.Uri.file(message.filePath);
                        const doc = await vscode.workspace.openTextDocument(uri);
                        await vscode.window.showTextDocument(doc);
                    }
                    break;
                case "showInfo":
                    if (message.text) {
                        vscode.window.showInformationMessage(message.text);
                    }
                    break;
                case "showWarning":
                    if (message.text) {
                        vscode.window.showWarningMessage(message.text);
                    }
                    break;
            }
        }, null, this.disposables);
        this.updateData(graph, violations);
    }
    updateData(graph, violations) {
        const nodes = graph.getAllComponents().map((c) => ({
            id: c.fullyQualifiedName,
            label: c.className,
            metadata: c,
        }));
        const edges = [];
        for (const comp of graph.getAllComponents()) {
            for (const target of graph.getOutgoing(comp.fullyQualifiedName)) {
                edges.push({
                    source: comp.fullyQualifiedName,
                    target: target,
                    relType: graph.getEdgeType(comp.fullyQualifiedName, target),
                });
            }
        }
        this.panel.webview.postMessage({
            command: "setData",
            nodes,
            edges,
            violations,
        });
    }
    selectNode(nodeId) {
        this.panel.webview.postMessage({
            command: "selectNode",
            nodeId,
        });
    }
    getHtmlForWebview(webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.file(path.join(this.extensionUri.fsPath, "dist", "explorer", "main.js")));
        return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Architecture Explorer</title>
        <style>
          :root {
            --toolbar-bg: var(--vscode-editor-background, #1e1e1e);
            --border-color: var(--vscode-panel-border, #2d2d2e);
            --input-bg: var(--vscode-input-background, #252526);
            --input-fg: var(--vscode-input-foreground, #cccccc);
            --button-bg: var(--vscode-button-secondaryBackground, #3c3c3c);
            --button-fg: var(--vscode-button-secondaryForeground, #ffffff);
            --button-hover: var(--vscode-button-secondaryHoverBackground, #4c4c4c);
            --button-primary-bg: var(--vscode-button-background, #007acc);
            --button-primary-fg: var(--vscode-button-foreground, #ffffff);
            --button-primary-hover: var(--vscode-button-hoverBackground, #0062a3);
            --inspector-bg: var(--vscode-sideBar-background, #1e1e1e);
            --text-color: var(--vscode-editor-foreground, #d4d4d4);
            --muted-color: var(--vscode-descriptionForeground, #858585);

            /* Typography Design Tokens */
            --fs-title: 13px;
            --fs-subtitle: 11px;
            --fs-heading: 10px;
            --fs-body: 11px;
            --fs-caption: 10px;

            /* Spacing Tokens */
            --spacing-xs: 4px;
            --spacing-sm: 8px;
            --spacing-md: 12px;
            --spacing-lg: 16px;
            --spacing-xl: 20px;

            /* Visual Tokens */
            --border-radius: 4px;
            --button-height: 26px;
            --transition-speed: 150ms;
          }

          body {
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            height: 100vh;
            background-color: var(--vscode-editor-background);
            color: var(--text-color);
            font-family: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
            overflow: hidden;
          }

          /* Minimalist Toolbar */
          #toolbar {
            display: flex;
            align-items: center;
            padding: 8px 16px;
            background-color: var(--toolbar-bg);
            gap: 12px;
            z-index: 15;
          }

          #search-container {
            display: flex;
            align-items: center;
          }

          #search-input {
            background-color: var(--input-bg);
            color: var(--input-fg);
            border: 1px solid var(--border-color);
            padding: 6px 10px;
            font-size: 11px;
            border-radius: 2px;
            width: 200px;
          }

          #search-input:focus {
            outline: 1px solid var(--vscode-focusBorder);
          }

          .toolbar-btn {
            background-color: transparent;
            color: var(--muted-color);
            border: none;
            padding: 6px;
            border-radius: 2px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.12s ease, background-color 0.12s ease;
          }

          .toolbar-btn:hover:not(:disabled) {
            color: var(--text-color);
            background-color: var(--vscode-toolbar-hoverBackground, rgba(90, 93, 94, 0.2));
          }

          .toolbar-btn:disabled {
            opacity: 0.25;
            cursor: default;
          }

          .toolbar-btn svg {
            fill: currentColor;
            width: 14px;
            height: 14px;
          }

          .toolbar-divider {
            width: 1px;
            height: 14px;
            background-color: var(--border-color);
          }

          /* Main Container */
          #main-container {
            display: flex;
            flex: 1;
            overflow: hidden;
            position: relative;
          }

          /* Minimalist Backdrop Separators */
          #graph-backdrop {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            display: flex;
            flex-direction: column;
            pointer-events: none;
            z-index: 1;
          }

          .backdrop-layer {
            flex: 1;
            border-bottom: 1px dashed var(--border-color);
            position: relative;
          }

          .layer-label {
            position: absolute;
            top: 12px;
            left: 20px;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 1.5px;
            color: var(--muted-color);
            opacity: 0.45;
          }

          /* Minimal Dotted Canvas */
          #cy {
            flex: 1;
            height: 100%;
            background-image: radial-gradient(var(--border-color) 1px, transparent 1px);
            background-size: 18px 18px;
            z-index: 3;
            position: relative;
          }

          /* Loading and Empty States */
          #loading-overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: var(--vscode-editor-background);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 10;
          }

          .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid var(--border-color);
            border-top: 2px solid var(--button-primary-bg);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          #empty-state {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: var(--vscode-editor-background);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9;
            text-align: center;
            padding: 20px;
          }

          /* Permanently Docked Spacing-Focused Inspector Panel */
          #inspector {
            width: 320px;
            background-color: var(--inspector-bg);
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            z-index: 12;
            padding: var(--spacing-lg);
            box-sizing: border-box;
            border-left: 1px solid var(--border-color);
          }

          #inspector-title {
            font-size: var(--fs-heading);
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            color: var(--muted-color);
            margin-bottom: var(--spacing-lg);
            padding-bottom: var(--spacing-sm);
            border-bottom: 1px solid var(--border-color);
          }

          #inspector-content {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-xl);
            font-size: var(--fs-body);
            flex: 1;
          }

          /* Minimalist Empty State styling */
          .inspector-empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            height: 100%;
          }

          .empty-state-icon {
            width: 36px;
            height: 36px;
            fill: var(--muted-color);
            opacity: 0.5;
            margin-bottom: 16px;
          }

          .empty-state-title {
            font-size: 12px;
            font-weight: 700;
            color: var(--vscode-editor-foreground);
            margin-bottom: 8px;
          }

          .empty-state-subtitle {
            font-size: 11px;
            color: var(--muted-color);
            line-height: 1.5;
          }

          /* Flat Spacing-driven Component Sections */
          .premium-card {
            display: flex;
            flex-direction: column;
          }

          .inspector-label {
            font-weight: 700;
            color: var(--muted-color);
            font-size: var(--fs-heading);
            text-transform: uppercase;
            margin-bottom: var(--spacing-sm);
            letter-spacing: 0.8px;
          }

          .inspector-value {
            word-break: break-all;
            line-height: 1.4;
          }

          .inspector-value.highlight {
            font-size: var(--fs-title);
            font-weight: 700;
            color: var(--text-color);
          }

          .inspector-stereotype {
            font-size: var(--fs-subtitle);
            color: var(--muted-color);
            margin-top: var(--spacing-xs);
          }

          .inspector-caption {
            font-size: var(--fs-caption);
            color: var(--muted-color);
            margin-top: var(--spacing-xs);
          }

          /* Clickable Chip Buttons */
          .chips-container {
            display: flex;
            flex-wrap: wrap;
            gap: var(--spacing-sm);
            margin-top: var(--spacing-xs);
          }

          .clickable-chip {
            cursor: pointer;
            background-color: var(--button-bg);
            color: var(--button-fg);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 4px var(--spacing-sm);
            font-size: var(--fs-body);
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease;
            height: var(--button-height);
            box-sizing: border-box;
          }

          .clickable-chip:hover {
            background-color: var(--button-hover);
            color: var(--text-color);
          }

          .clickable-violation-chip {
            cursor: pointer;
            background-color: var(--button-bg);
            color: var(--button-fg);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 2px 6px;
            font-size: 9px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease;
          }
          .clickable-violation-chip:hover {
            background-color: var(--button-hover);
            color: var(--text-color);
          }

          /* Quick Action Buttons list */
          .quick-actions-container {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-sm);
            margin-top: var(--spacing-xs);
          }

          .quick-action-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            border: 1px solid var(--border-color);
            background-color: var(--button-bg);
            color: var(--button-fg);
            padding: 4px var(--spacing-md);
            font-size: var(--fs-body);
            font-weight: 600;
            cursor: pointer;
            text-align: left;
            border-radius: var(--border-radius);
            height: var(--button-height);
            box-sizing: border-box;
            transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease;
          }

          .quick-action-btn:hover {
            background-color: var(--button-hover);
            color: var(--text-color);
          }

          .quick-action-btn svg {
            width: 12px;
            height: 12px;
            fill: currentColor;
          }

          /* Spacing Violations */
          .inspector-violations {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-sm);
          }

          .violation-card-premium {
            border-left: 2px solid #e51c23;
            padding-left: 10px;
            margin-bottom: var(--spacing-xs);
          }

          .violation-badge {
            font-size: var(--fs-caption);
            font-weight: 700;
            text-transform: uppercase;
            display: inline-block;
            margin-bottom: var(--spacing-xs);
          }
          .violation-badge.error { color: #e51c23; }
          .violation-badge.warning { color: #f1c40f; }

          .violation-msg {
            line-height: 1.4;
            color: var(--text-color);
          }

          .no-violations {
            color: #4caf50;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div id="toolbar">
          <div id="search-container">
            <input type="text" id="search-input" placeholder="Search components...">
          </div>
          <button class="toolbar-btn" id="back-btn" title="Back (Alt+Left)" disabled>
            <svg viewBox="0 0 16 16"><path d="M11.5 14a.5.5 0 0 1-.35-.15l-5-5a.5.5 0 0 1 0-.7l5-5a.5.5 0 1 1 .7.7L7.2 9l4.65 4.65a.5.5 0 0 1-.35.85z"/></svg>
          </button>
          <button class="toolbar-btn" id="forward-btn" title="Forward (Alt+Right)" disabled>
            <svg viewBox="0 0 16 16"><path d="M4.5 14a.5.5 0 0 1-.35-.85L8.8 8.5 4.15 3.85a.5.5 0 1 1 .7-.7l5 5a.5.5 0 0 1 0 .7l-5 5a.5.5 0 0 1-.35.15z"/></svg>
          </button>
          <div class="toolbar-divider"></div>
          <span style="font-size: 10px; color: var(--muted-color); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-right: 4px;">Filter:</span>
          <select id="filter-select" style="background-color: var(--input-bg); color: var(--input-fg); border: 1px solid var(--border-color); padding: 3px 6px; font-size: 11px; border-radius: 2px; outline: none; cursor: pointer; height: 22px;">
            <option value="all">All Components</option>
            <option value="controllers">Controllers</option>
            <option value="services">Services</option>
            <option value="repositories">Repositories</option>
            <option value="entities">Entities</option>
            <option value="violations">Only Violations</option>
            <option value="healthy">Only Healthy Components</option>
            <option value="circular">Circular Dependencies</option>
            <option value="unused">Unused Services</option>
            <option value="layer">Layer Violations</option>
          </select>
          <div class="toolbar-divider"></div>
          <button class="toolbar-btn" id="fit-btn" title="Fit Graph (Space)">
            <svg viewBox="0 0 16 16"><path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 1 0v-2.5h2.5a.5.5 0 0 0 0-1h-3zm13 0a.5.5 0 0 0-.5.5v2.5h-2.5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm-13 13a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 0-1h-2.5v-2.5a.5.5 0 0 0-1 0v3zm13 0a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-1 0v2.5h-2.5a.5.5 0 0 0 0 1h3zM8 4.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>
          </button>
          <button class="toolbar-btn" id="relayout-btn" title="Relayout Components">
            <svg viewBox="0 0 16 16"><path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM8 14A6 6 0 1 1 8 2a6 6 0 0 1 0 12zm2-7.5H6v3h4v-3z"/></svg>
          </button>
          <button class="toolbar-btn" id="focus-btn" title="Focus Selected Node">
            <svg viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 15a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-10a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 5a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg>
          </button>
          <div class="toolbar-divider"></div>
          <button class="toolbar-btn" title="Export Graph (Coming Soon)" disabled style="opacity:0.3;">
            <svg viewBox="0 0 16 16"><path d="M11 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V3.7l-4.15 4.15a.5.5 0 0 1-.7-.7L12.3 3H11.5a.5.5 0 0 1-.5-.5zM3 3h4.5a.5.5 0 0 1 0 1H3v10h10v-4.5a.5.5 0 0 1 1 0V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/></svg>
          </button>
          <button class="toolbar-btn" title="Settings (Coming Soon)" disabled style="opacity:0.3;">
            <svg viewBox="0 0 16 16"><path d="M9.1 4.4L8.6 2H7.4l-.5 2.4-.7.3-2-1.3-.9.9 1.3 2-.3.7-2.4.5v1.2l2.4.5.3.7-1.3 2 .9.9 2-1.3.7.3.5 2.4h1.2l.5-2.4.7-.3 2 1.3.9-.9-1.3-2 .3-.7 2.4-.5V8.6l-2.4-.5-.3-.7 1.3-2-.9-.9-2 1.3-.7-.3-.5-2.4zM8 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg>
          </button>
        </div>
        <div id="main-container">
          <div id="graph-backdrop">
            <div class="backdrop-layer"><span class="layer-label">CONTROLLERS</span></div>
            <div class="backdrop-layer"><span class="layer-label">SERVICES</span></div>
            <div class="backdrop-layer"><span class="layer-label">REPOSITORIES</span></div>
            <div class="backdrop-layer" style="border-bottom: none;"><span class="layer-label">ENTITIES & CLASSES</span></div>
          </div>

          <div id="loading-overlay">
            <div class="spinner"></div>
            <div style="margin-top: 12px; font-size: 11px; font-weight: 600; color: var(--muted-color);">Generating Architecture Graph...</div>
          </div>
          <div id="empty-state" style="display: none;">
            <svg viewBox="0 0 16 16" width="32" height="32" style="fill: var(--muted-color);"><path d="M1.5 1h13l.5.5v13l-.5.5h-13l-.5-.5v-13l.5-.5zM2 14h12V2H2v12zm4-6.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z"/></svg>
            <div style="font-weight: 700; margin-top: 12px; font-size: 12px;">No analysis has been performed.</div>
            <div style="color: var(--muted-color); margin-top: 4px; font-size: 11px; width: 240px; line-height: 1.5;">Analyze your Spring Boot project to visualize its architecture.</div>
          </div>
          <div id="cy"></div>
          <div id="inspector">
            <div id="inspector-title">Inspector</div>
            <div id="inspector-content">
              <div class="inspector-placeholder">Click a node to inspect properties</div>
            </div>
          </div>
        </div>
        <script src="${scriptUri}"></script>
      </body>
      </html>`;
    }
    dispose() {
        ArchitectureExplorerPanel.currentPanel = undefined;
        this.panel.dispose();
        while (this.disposables.length) {
            const x = this.disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
}
ArchitectureExplorerPanel.viewType = "codeatlasExplorer";
