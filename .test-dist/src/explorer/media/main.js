import cytoscape from "cytoscape";
const vscode = acquireVsCodeApi();
let cy = null;
let graphData = { nodes: [], edges: [], violations: [] };
let selectedNodeId = null;
let activeHighlightMode = null;
// History Navigation Stacks
let backStack = [];
let forwardStack = [];
let lastValidWidth = 800;
// DOM Elements
const searchInput = document.getElementById("search-input");
const fitButton = document.getElementById("fit-btn");
const relayoutButton = document.getElementById("relayout-btn");
const focusButton = document.getElementById("focus-btn");
const backButton = document.getElementById("back-btn");
const forwardButton = document.getElementById("forward-btn");
const inspectorContent = document.getElementById("inspector-content");
const loadingOverlay = document.getElementById("loading-overlay");
const emptyState = document.getElementById("empty-state");
window.addEventListener("message", (event) => {
    const message = event.data;
    if (message.command === "setData") {
        graphData = {
            nodes: message.nodes,
            edges: message.edges,
            violations: message.violations,
        };
        if (loadingOverlay) {
            loadingOverlay.style.display = "none";
        }
        if (graphData.nodes.length === 0) {
            if (emptyState)
                emptyState.style.display = "flex";
            const container = document.getElementById("cy");
            if (container)
                container.style.display = "none";
        }
        else {
            if (emptyState)
                emptyState.style.display = "none";
            const container = document.getElementById("cy");
            if (container)
                container.style.display = "block";
            clearHighlight();
            initGraph();
        }
    }
    else if (message.command === "selectNode") {
        if (message.nodeId) {
            selectNode(message.nodeId, true);
        }
    }
});
function getLayerIndex(type) {
    switch (type) {
        case "CONTROLLER": return 0;
        case "SERVICE": return 1;
        case "REPOSITORY": return 2;
        case "ENTITY": return 3;
        default: return 3;
    }
}
function calculateLayeredPositions(nodes, width) {
    const layers = new Map();
    for (let i = 0; i < 4; i++) {
        layers.set(i, []);
    }
    for (const node of nodes) {
        const layerIdx = getLayerIndex(node.metadata.type);
        layers.get(layerIdx).push(node);
    }
    const positions = new Map();
    const ySpacing = 200;
    const xSpacing = 210;
    for (let layerIdx = 0; layerIdx < 4; layerIdx++) {
        const layerNodes = layers.get(layerIdx);
        layerNodes.sort((a, b) => a.label.localeCompare(b.label));
        const y = 90 + layerIdx * ySpacing;
        const numNodes = layerNodes.length;
        for (let i = 0; i < numNodes; i++) {
            const node = layerNodes[i];
            const x = (width / 2) + (i - (numNodes - 1) / 2) * xSpacing;
            positions.set(node.id, { x, y });
        }
    }
    return positions;
}
function getComponentIcon(type) {
    switch (type) {
        case "CONTROLLER": return "⚡";
        case "SERVICE": return "⚙";
        case "REPOSITORY": return "📂";
        case "ENTITY": return "📦";
        default: return "📄";
    }
}
function getComponentAnnotation(type) {
    switch (type) {
        case "CONTROLLER": return "@RestController";
        case "SERVICE": return "@Service";
        case "REPOSITORY": return "@Repository";
        case "ENTITY": return "@Entity";
        default: return "Class";
    }
}
function initGraph() {
    const container = document.getElementById("cy");
    if (!container)
        return;
    if (cy) {
        cy.destroy();
        cy = null;
    }
    // Reset history on reload
    backStack = [];
    forwardStack = [];
    selectedNodeId = null;
    updateNavigationButtons();
    const elements = [];
    for (const node of graphData.nodes) {
        elements.push({
            data: {
                id: node.id,
                label: node.label,
                type: node.metadata.type,
                metadata: node.metadata,
            },
            classes: "hidden-on-load",
        });
    }
    for (const edge of graphData.edges) {
        elements.push({
            data: {
                id: `${edge.source}-${edge.target}`,
                source: edge.source,
                target: edge.target,
            },
            classes: "hidden-on-load",
        });
    }
    const clientWidth = container.clientWidth;
    if (clientWidth > 0) {
        lastValidWidth = clientWidth;
    }
    const positions = calculateLayeredPositions(graphData.nodes, lastValidWidth);
    for (const el of elements) {
        if (el.data.id && positions.has(el.data.id)) {
            el.position = positions.get(el.data.id);
        }
    }
    cy = cytoscape({
        container: container,
        elements: elements,
        style: [
            {
                selector: "node",
                style: {
                    label: (ele) => {
                        const icon = getComponentIcon(ele.data("type"));
                        const name = ele.data("label");
                        const annotation = getComponentAnnotation(ele.data("type"));
                        const fqName = ele.id();
                        const nodeViolations = graphData.violations.filter((v) => v.affectedNodes.includes(fqName));
                        let indicator = "🟢"; // Healthy component dot ●
                        if (nodeViolations.length > 0) {
                            const hasErrors = nodeViolations.some(v => v.severity === "ERROR");
                            indicator = hasErrors ? "🔴" : "🟡"; // Error ●, Warning ●
                        }
                        return `${indicator}  ${icon}  ${name}\n${annotation}`;
                    },
                    "text-wrap": "wrap",
                    "background-color": "var(--vscode-editor-background, #1e1e1e)",
                    "color": "var(--vscode-editor-foreground, #d4d4d4)",
                    "border-width": 1.0,
                    "border-color": (ele) => {
                        const type = ele.data("type");
                        if (type === "CONTROLLER")
                            return "#2196f3"; // Blue
                        if (type === "SERVICE")
                            return "#4caf50"; // Green
                        if (type === "REPOSITORY")
                            return "#ff9800"; // Orange
                        if (type === "ENTITY")
                            return "#9c27b0"; // Purple
                        return "#7f8c8d"; // Gray/CLASS
                    },
                    "font-size": "10.5px",
                    "font-family": "var(--vscode-font-family)",
                    "font-weight": 600,
                    "text-valign": "center",
                    "text-halign": "center",
                    "text-max-width": "130px",
                    "width": "144px",
                    "height": "52px",
                    "shape": "round-rectangle",
                    "corner-radius": "4px",
                    "line-height": 1.5,
                    opacity: 1,
                    "transition-property": "opacity, border-width, width, height, border-color, background-color",
                    "transition-duration": 0.15,
                    "transition-timing-function": "ease-out",
                },
            },
            {
                selector: "node:hover",
                style: {
                    "width": "148.3px",
                    "height": "53.5px",
                    "border-width": 2.0,
                    "border-color": "#ffffff",
                },
            },
            {
                selector: "edge",
                style: {
                    "width": 1.5,
                    "line-color": "var(--vscode-panel-border, #3c3c3c)",
                    "target-arrow-color": "var(--vscode-panel-border, #3c3c3c)",
                    "target-arrow-shape": "triangle",
                    "curve-style": "bezier",
                    opacity: 1,
                    "transition-property": "opacity, width, line-color, target-arrow-color",
                    "transition-duration": 0.15,
                    "transition-timing-function": "ease-out",
                },
            },
            {
                selector: "node:selected",
                style: {
                    "border-width": 2.5,
                    "background-color": "var(--vscode-list-hoverBackground, #2a2d2e)",
                    "border-color": "var(--vscode-focusBorder, #007acc)",
                },
            },
            {
                selector: ".selected-focus-node",
                style: {
                    "width": "151.2px",
                    "height": "54.6px",
                    "z-index": 999,
                    opacity: 1,
                },
            },
            {
                selector: ".dependency-node",
                style: {
                    "border-color": "#ff9800",
                    "border-width": 2.5,
                    opacity: 0.90,
                    "z-index": 998,
                },
            },
            {
                selector: ".dependent-node",
                style: {
                    "border-color": "#ff9800",
                    "border-width": 2.5,
                    opacity: 0.90,
                    "z-index": 998,
                },
            },
            {
                selector: ".unrelated-node",
                style: {
                    opacity: 0.20,
                },
            },
            {
                selector: ".connected-edge",
                style: {
                    opacity: 1.0,
                    "width": 4.5,
                    "line-color": "#ffaa00",
                    "target-arrow-color": "#ffaa00",
                    "target-arrow-shape": "triangle",
                    "target-arrow-fill": "filled",
                    "arrow-scale": 1.8,
                    "line-style": "dashed",
                    "line-dash-pattern": [8, 5],
                    "line-dash-offset": 0,
                    "shadow-color": "#ffaa00",
                    "shadow-blur": 6,
                    "shadow-opacity": 0.6,
                    "z-index": 9999,
                },
            },
            {
                selector: ".unrelated-edge",
                style: {
                    opacity: 0.10,
                    "width": 1.0,
                },
            },
            {
                selector: ".violating-node",
                style: {
                    "background-color": "#ff3333",
                    "border-color": "#ff3333",
                    "color": "#ffffff",
                    "border-width": 2.5,
                    opacity: 1.0,
                    "z-index": 998,
                },
            },
            {
                selector: ".violating-edge",
                style: {
                    "line-color": "#ff3333",
                    "target-arrow-color": "#ff3333",
                    "target-arrow-shape": "triangle",
                    "target-arrow-fill": "filled",
                    "arrow-scale": 1.8,
                    "line-style": "dashed",
                    "line-dash-pattern": [8, 5],
                    "line-dash-offset": 0,
                    "shadow-color": "#ff3333",
                    "shadow-blur": 6,
                    "shadow-opacity": 0.6,
                    "width": 4.5,
                    opacity: 1.0,
                    "z-index": 9999,
                },
            },
            {
                selector: ".hidden-on-load",
                style: {
                    opacity: 0,
                },
            },
            {
                selector: ".dimmed-hover",
                style: {
                    opacity: 0.60,
                },
            },
            {
                selector: "edge.dimmed-hover",
                style: {
                    opacity: 0.40,
                },
            },
            {
                selector: ".filtered-out",
                style: {
                    display: "none",
                },
            },
        ],
        userZoomingEnabled: true,
        userPanningEnabled: true,
        boxSelectionEnabled: false,
        minZoom: 0.15,
        maxZoom: 2.2,
    });
    const checkBounds = () => {
        if (!cy)
            return;
        const pan = cy.pan();
        const zoom = cy.zoom();
        const container = cy.container();
        if (!container)
            return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        const boundingBox = cy.elements().boundingBox({});
        if (boundingBox.x1 === Infinity || isNaN(boundingBox.x1))
            return;
        const margin = 100;
        const minX = -boundingBox.x2 * zoom + margin;
        const maxX = w - boundingBox.x1 * zoom - margin;
        const minY = -boundingBox.y2 * zoom + margin;
        const maxY = h - boundingBox.y1 * zoom - margin;
        let corrected = false;
        let x = pan.x;
        let y = pan.y;
        if (x < minX) {
            x = minX;
            corrected = true;
        }
        if (x > maxX) {
            x = maxX;
            corrected = true;
        }
        if (y < minY) {
            y = minY;
            corrected = true;
        }
        if (y > maxY) {
            y = maxY;
            corrected = true;
        }
        if (corrected) {
            cy.pan({ x, y });
        }
    };
    cy.on("pan", checkBounds);
    cy.on("zoom", checkBounds);
    let dashOffset = 0;
    function animateDash() {
        if (!cy) {
            requestAnimationFrame(animateDash);
            return;
        }
        dashOffset = (dashOffset - 0.4) % 100;
        cy.edges(".connected-edge, .violating-edge").style("line-dash-offset", dashOffset);
        requestAnimationFrame(animateDash);
    }
    requestAnimationFrame(animateDash);
    applyLayout(false);
    requestAnimationFrame(() => {
        if (cy) {
            cy.elements().removeClass("hidden-on-load");
        }
    });
    cy.on("mouseover", "node", (evt) => {
        const node = evt.target;
        if (selectedNodeId)
            return;
        applyPathHighlight(node, false);
    });
    cy.on("mouseout", "node", () => {
        if (selectedNodeId)
            return;
        clearHighlight();
    });
    cy.on("tap", "node", (evt) => {
        const node = evt.target;
        selectNode(node.id(), true);
    });
    cy.on("select", "node", (evt) => {
        const node = evt.target;
        if (selectedNodeId !== node.id()) {
            selectNode(node.id(), true);
        }
    });
    cy.on("unselect", "node", (evt) => {
        const node = evt.target;
        if (selectedNodeId === node.id()) {
            setTimeout(() => {
                if (cy && cy.nodes(":selected").length === 0) {
                    deselectNode();
                }
            }, 0);
        }
    });
    cy.on("dbltap", "node", (evt) => {
        const node = evt.target;
        const metadata = node.data("metadata");
        if (metadata && metadata.filePath) {
            vscode.postMessage({
                command: "openFile",
                filePath: metadata.filePath,
            });
        }
    });
    cy.on("tap", (evt) => {
        if (evt.target === cy) {
            deselectNode();
            backStack = [];
            forwardStack = [];
            updateNavigationButtons();
        }
    });
    showInspectorEmptyState();
}
function deselectNode() {
    if (!cy)
        return;
    selectedNodeId = null;
    cy.nodes().unselect();
    clearHighlight();
    showInspectorEmptyState();
}
function selectNode(nodeId, pushHistory) {
    if (!cy)
        return;
    const node = cy.getElementById(nodeId);
    if (node.length === 0)
        return;
    if (pushHistory && selectedNodeId && selectedNodeId !== nodeId) {
        backStack.push(selectedNodeId);
        forwardStack = []; // Reset forward history on fresh node selection
    }
    selectedNodeId = nodeId;
    clearHighlight();
    cy.nodes().unselect();
    node.select();
    node.addClass("selected-focus-node");
    updateInspector(node.data("metadata"));
    // Spatial viewport check for central 35% comfort zone (preserving zoom!)
    const pos = node.position();
    const extent = cy.extent();
    const w = extent.x2 - extent.x1;
    const h = extent.y2 - extent.y1;
    const xPad = w * 0.325;
    const yPad = h * 0.325;
    const comfortablyVisible = pos.x >= extent.x1 + xPad && pos.x <= extent.x2 - xPad &&
        pos.y >= extent.y1 + yPad && pos.y <= extent.y2 - yPad;
    if (!comfortablyVisible) {
        const container = cy.container();
        const containerHeight = container ? container.clientHeight : 600;
        const currentZoom = cy.zoom();
        const panX = lastValidWidth / 2 - pos.x * currentZoom;
        const panY = containerHeight / 2 - pos.y * currentZoom;
        cy.animate({
            pan: { x: panX, y: panY },
        }, { duration: 200, easing: "ease-out" });
    }
    updateNavigationButtons();
}
function navigateBack() {
    if (backStack.length === 0 || !selectedNodeId)
        return;
    forwardStack.push(selectedNodeId);
    const prevId = backStack.pop();
    selectNode(prevId, false);
}
function navigateForward() {
    if (forwardStack.length === 0 || !selectedNodeId)
        return;
    backStack.push(selectedNodeId);
    const nextId = forwardStack.pop();
    selectNode(nextId, false);
}
function updateNavigationButtons() {
    if (backButton) {
        backButton.disabled = backStack.length === 0;
    }
    if (forwardButton) {
        forwardButton.disabled = forwardStack.length === 0;
    }
}
function applyPathHighlight(node, isSelection) {
    if (!cy)
        return;
    clearHighlight();
    if (isSelection) {
        const directDependencies = node.outgoers("node");
        const directDependents = node.incomers("node");
        node.addClass("selected-focus-node");
        directDependencies.addClass("dependency-node");
        directDependents.addClass("dependent-node");
        const related = node.union(directDependencies).union(directDependents);
        cy.nodes().not(related).addClass("unrelated-node");
        const connectedEdges = node.connectedEdges();
        connectedEdges.addClass("connected-edge");
        cy.edges().not(connectedEdges).addClass("unrelated-edge");
    }
    else {
        const connectedNodes = node.closedNeighborhood();
        cy.elements().addClass("dimmed-hover");
        connectedNodes.removeClass("dimmed-hover");
        node.connectedEdges().removeClass("dimmed-hover");
    }
}
function clearHighlight() {
    if (!cy)
        return;
    cy.elements()
        .removeClass("dimmed-hover")
        .removeClass("selected-focus-node")
        .removeClass("dependency-node")
        .removeClass("dependent-node")
        .removeClass("unrelated-node")
        .removeClass("connected-edge")
        .removeClass("unrelated-edge")
        .removeClass("violating-node")
        .removeClass("violating-edge")
        .removeClass("highlighted-node");
    activeHighlightMode = null;
}
function applyLayout(animate) {
    if (!cy)
        return;
    const container = document.getElementById("cy");
    if (!container)
        return;
    const clientWidth = container.clientWidth;
    if (clientWidth > 0) {
        lastValidWidth = clientWidth;
    }
    const positions = calculateLayeredPositions(graphData.nodes, lastValidWidth);
    cy.nodes().each((node) => {
        const pos = positions.get(node.id());
        if (pos) {
            if (animate) {
                node.animate({ position: pos }, { duration: 250, easing: "ease-in-out-cubic" });
            }
            else {
                node.position(pos);
            }
        }
    });
    if (animate) {
        setTimeout(() => {
            cy?.animate({ fit: { padding: 30 } }, { duration: 250, easing: "ease-in-out-cubic" });
        }, 280);
    }
    else {
        cy.fit(undefined, 30);
    }
}
function showInspectorEmptyState() {
    if (graphData.nodes.length === 0) {
        inspectorContent.innerHTML = `
      <div class="inspector-empty-state">
        <svg class="empty-state-icon" viewBox="0 0 16 16">
          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 15a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-10a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 5a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
        </svg>
        <div class="empty-state-title">Architecture Inspector</div>
        <div class="empty-state-subtitle">Select a component in the graph<br>to inspect its architecture.</div>
      </div>
    `;
        return;
    }
    const controllersCount = graphData.nodes.filter(n => n.metadata.type === "CONTROLLER").length;
    const servicesCount = graphData.nodes.filter(n => n.metadata.type === "SERVICE").length;
    const repositoriesCount = graphData.nodes.filter(n => n.metadata.type === "REPOSITORY").length;
    const entitiesCount = graphData.nodes.filter(n => n.metadata.type === "ENTITY").length;
    let score = 100;
    let bypassCount = 0;
    let circularCount = 0;
    let unusedCount = 0;
    for (const v of graphData.violations) {
        if (v.type === "BYPASS_SERVICE") {
            score -= 10;
            bypassCount++;
        }
        else if (v.type === "CIRCULAR_DEPENDENCY") {
            score -= 15;
            circularCount++;
        }
        else if (v.type === "UNUSED_SERVICE") {
            score -= 5;
            unusedCount++;
        }
    }
    score = Math.max(0, Math.min(100, score));
    inspectorContent.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: var(--spacing-md); color: var(--text-color);">
      <div style="font-size: var(--fs-title); font-weight: 700; margin-bottom: var(--spacing-xs);">Architecture Overview</div>
      
      <div class="premium-card">
        <div style="font-size: var(--fs-title); font-weight: 700; color: var(--text-color); margin-bottom: var(--spacing-sm);">${graphData.nodes.length} Components</div>
        <div style="display: flex; flex-direction: column; gap: var(--spacing-xs); font-size: var(--fs-body);">
          <div style="display: flex; justify-content: space-between;"><span>Controllers</span><span style="font-weight: 600;">${controllersCount}</span></div>
          <div style="display: flex; justify-content: space-between;"><span>Services</span><span style="font-weight: 600;">${servicesCount}</span></div>
          <div style="display: flex; justify-content: space-between;"><span>Repositories</span><span style="font-weight: 600;">${repositoriesCount}</span></div>
          <div style="display: flex; justify-content: space-between;"><span>Entities</span><span style="font-weight: 600;">${entitiesCount}</span></div>
        </div>
      </div>

      <div class="premium-card">
        <div class="inspector-label" style="margin-bottom: var(--spacing-xs);">Architecture Health</div>
        <div style="font-size: var(--fs-title); font-weight: 700; color: var(--text-color);">${score} / 100</div>
      </div>

      <div class="premium-card">
        <div class="inspector-label" style="margin-bottom: var(--spacing-xs);">Top Issues</div>
        <div style="display: flex; flex-direction: column; gap: var(--spacing-xs); font-size: var(--fs-body);">
          <div style="display: flex; justify-content: space-between;"><span>• ${bypassCount} Layer Violations</span></div>
          <div style="display: flex; justify-content: space-between;"><span>• ${circularCount} Circular Dependencies</span></div>
          <div style="display: flex; justify-content: space-between;"><span>• ${unusedCount} Unused Services</span></div>
        </div>
      </div>

      <div style="font-size: var(--fs-caption); color: var(--muted-color); font-style: italic; margin-top: var(--spacing-sm); text-align: center; line-height: 1.4;">
        Select any component in the graph to inspect.
      </div>
    </div>
  `;
}
function getRuleRecommendation(type) {
    switch (type) {
        case "BYPASS_SERVICE":
            return "Introduce a Service layer between the Controller and Repository.";
        case "CIRCULAR_DEPENDENCY":
            return "Extract shared behaviour into a third service or replace direct coupling with an event-driven interaction.";
        case "UNUSED_SERVICE":
            return "Remove the service or register a consumer if it is expected to be used.";
        default:
            return "Review architectural guidelines and refactor dependencies.";
    }
}
function updateInspector(metadata) {
    if (!metadata)
        return;
    const type = metadata.type;
    const fqName = metadata.fullyQualifiedName;
    const className = metadata.className;
    const node = cy?.getElementById(fqName);
    const dependsOn = node
        ? node.outgoers("node").map((n) => ({ id: n.id(), label: n.data("label"), type: n.data("type") }))
        : [];
    const usedBy = node
        ? node.incomers("node").map((n) => ({ id: n.id(), label: n.data("label"), type: n.data("type") }))
        : [];
    const nodeViolations = graphData.violations.filter((v) => v.affectedNodes.includes(fqName));
    let violationsHtml = "<div class='no-violations'>✓ No architectural issues detected.</div>";
    if (nodeViolations.length > 0) {
        const headerMsg = `<div style='font-weight: 700; color: var(--vscode-testing-iconFailed); margin-bottom: var(--spacing-sm);'>${nodeViolations.length} Architecture Violation${nodeViolations.length > 1 ? "s" : ""}</div>`;
        violationsHtml = headerMsg + nodeViolations
            .map((v) => `
        <details class="violation-card-premium" style="cursor: pointer; margin-bottom: var(--spacing-sm);">
          <summary style="font-weight: 700; color: var(--vscode-testing-iconFailed); outline: none;">
            ${v.type}
          </summary>
          <div style="margin-top: var(--spacing-xs); padding-top: var(--spacing-xs); border-top: 1px solid var(--vscode-panel-border, #3c3c3c); font-size: 10px; display: flex; flex-direction: column; gap: var(--spacing-xs);">
            <div><strong>Rule:</strong> ${v.type}</div>
            <div><strong>Explanation:</strong> ${v.message}</div>
            <div><strong>Affected:</strong>
              <div class="chips-container" style="margin-top: 2px;">
                ${v.affectedNodes.map((nodeId) => {
            const label = nodeId.split(".").pop();
            return `<button class="clickable-violation-chip" data-id="${nodeId}">${label}</button>`;
        }).join("")}
              </div>
            </div>
            <div><strong>Dependency Chain:</strong> ${v.affectedNodes.map((nodeId) => nodeId.split(".").pop()).join(" &rarr; ")}</div>
            <div style="color: var(--vscode-editor-foreground); font-style: italic; margin-top: 2px;"><strong>Recommendation:</strong> ${getRuleRecommendation(v.type)}</div>
          </div>
        </details>
      `)
            .join("");
    }
    let bannerHtml = "";
    let actionsHtml = "";
    if (activeHighlightMode) {
        let friendlyLabel = "";
        if (activeHighlightMode === "incoming")
            friendlyLabel = "Incoming Dependencies";
        else if (activeHighlightMode === "outgoing")
            friendlyLabel = "Outgoing Dependencies";
        else if (activeHighlightMode === "entities")
            friendlyLabel = "Entity Mapping";
        else if (activeHighlightMode === "trace-chain")
            friendlyLabel = "Service Chain Trace";
        else if (activeHighlightMode === "violation-path")
            friendlyLabel = "Violation Path";
        bannerHtml = `
      <div class="investigation-indicator-card" style="background-color: var(--vscode-statusBar-debuggingBackground, #b52007); color: #ffffff; padding: var(--spacing-xs) var(--spacing-sm); border-radius: var(--border-radius); font-size: 10px; font-weight: 700; margin-bottom: var(--spacing-sm); text-transform: uppercase; display: flex; flex-direction: column; gap: 2px; border-left: 3px solid var(--vscode-testing-iconFailed, #ff4d4f);">
        <span style="opacity: 0.8; font-size: 9px;">Investigation Mode</span>
        <span>Showing: ${friendlyLabel}</span>
      </div>
    `;
        actionsHtml = `
      <button class="quick-action-btn" id="action-clear-investigation" style="border: 1px solid var(--vscode-button-border, #007acc); color: var(--vscode-button-foreground, #ffffff); background-color: var(--vscode-button-background, #007acc); font-weight: 600;">
        ✓ Clear Investigation
      </button>
    `;
    }
    else {
        actionsHtml = `
      <button class="quick-action-btn" id="action-open-src">
        <svg viewBox="0 0 16 16"><path d="M3 1v14h10V1H3zm1 1h8v12H4V2zm2 2v1h4V4H6zm0 2v1h4V6H6zm0 2v1h4V8H6z"/></svg> Open Source File
      </button>
      <button class="quick-action-btn" id="action-focus">
        <svg viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 15a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-10a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 5a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg> Focus Component
      </button>
    `;
        if (type === "SERVICE") {
            actionsHtml += `
        <button class="quick-action-btn" id="action-show-incoming">
          <svg viewBox="0 0 16 16"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13a6 6 0 1 1 0-12 6 6 0 0 1 0 12z M7 4h2v5H7V4zm0 6h2v2H7v-2z"/></svg> Show Incoming Dependencies
        </button>
        <button class="quick-action-btn" id="action-show-outgoing">
          <svg viewBox="0 0 16 16"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13a6 6 0 1 1 0-12 6 6 0 0 1 0 12z M7 4h2v5H7V4zm0 6h2v2H7v-2z"/></svg> Show Outgoing Dependencies
        </button>
      `;
        }
        else if (type === "REPOSITORY") {
            actionsHtml += `
        <button class="quick-action-btn" id="action-show-entities">
          <svg viewBox="0 0 16 16"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13a6 6 0 1 1 0-12 6 6 0 0 1 0 12z M7 4h2v5H7V4zm0 6h2v2H7v-2z"/></svg> Show Entity Mapping
        </button>
        <button class="quick-action-btn" id="action-show-incoming">
          <svg viewBox="0 0 16 16"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13a6 6 0 1 1 0-12 6 6 0 0 1 0 12z M7 4h2v5H7V4zm0 6h2v2H7v-2z"/></svg> Show Incoming Dependencies
        </button>
      `;
        }
        else if (type === "CONTROLLER") {
            actionsHtml += `
        <button class="quick-action-btn" id="action-trace-chain">
          <svg viewBox="0 0 16 16"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13a6 6 0 1 1 0-12 6 6 0 0 1 0 12z M7 4h2v5H7V4zm0 6h2v2H7v-2z"/></svg> Trace Service Chain
        </button>
        <button class="quick-action-btn" id="action-show-outgoing">
          <svg viewBox="0 0 16 16"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13a6 6 0 1 1 0-12 6 6 0 0 1 0 12z M7 4h2v5H7V4zm0 6h2v2H7v-2z"/></svg> Show Dependencies
        </button>
      `;
        }
        if (nodeViolations.length > 0) {
            actionsHtml += `
        <button class="quick-action-btn" id="action-highlight-violation">
          <svg viewBox="0 0 16 16"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13a6 6 0 1 1 0-12 6 6 0 0 1 0 12z M7 4h2v5H7V4zm0 6h2v2H7v-2z"/></svg> Highlight Violation Path
        </button>
      `;
        }
    }
    inspectorContent.innerHTML = `
    ${bannerHtml}
    <!-- Header Component Info -->
    <div class="premium-card">
      <div class="inspector-value highlight">${metadata.className}</div>
      <div class="inspector-stereotype">${getComponentAnnotation(type)}</div>
      <div class="inspector-caption">${metadata.packageName || "(default package)"}</div>
    </div>

    <!-- Dependencies Card -->
    <div class="premium-card">
      <div class="inspector-label">Dependencies</div>
      ${dependsOn.length > 0
        ? "<div class=\"chips-container\">" + dependsOn.map(d => `
            <button class="clickable-chip" data-id="${d.id}">
              ${getComponentIcon(d.type)}  ${d.label}
            </button>
          `).join("") + "</div>"
        : `<div style='color: var(--vscode-descriptionForeground); font-style: italic; font-size: 10px; margin-top: var(--spacing-xs);'>${className} has no outgoing dependencies</div>`}
    </div>

    <!-- Used By Card -->
    <div class="premium-card">
      <div class="inspector-label">Used By</div>
      ${usedBy.length > 0
        ? "<div class=\"chips-container\">" + usedBy.map(d => `
            <button class="clickable-chip" data-id="${d.id}">
              ${getComponentIcon(d.type)}  ${d.label}
            </button>
          `).join("") + "</div>"
        : `<div style='color: var(--vscode-descriptionForeground); font-style: italic; font-size: 10px; margin-top: var(--spacing-xs);'>${className} has no incoming dependencies</div>`}
    </div>

    <!-- Violations Card -->
    <div class="premium-card">
      <div class="inspector-label">Violations</div>
      <div class="inspector-violations">${violationsHtml}</div>
    </div>

    <!-- Quick Actions Card -->
    <div class="premium-card">
      <div class="inspector-label">Quick Actions</div>
      <div class="quick-actions-container">
        ${actionsHtml}
      </div>
    </div>
  `;
    // Bind handlers
    if (activeHighlightMode) {
        document.getElementById("action-clear-investigation")?.addEventListener("click", () => {
            clearHighlight();
            node?.addClass("selected-focus-node");
            updateInspector(metadata);
        });
    }
    else {
        document.getElementById("action-open-src")?.addEventListener("click", () => {
            if (metadata.filePath) {
                vscode.postMessage({
                    command: "openFile",
                    filePath: metadata.filePath,
                });
            }
        });
        document.getElementById("action-focus")?.addEventListener("click", () => {
            if (cy && node) {
                cy.animate({ center: node }, { duration: 200, easing: "ease-out" });
            }
        });
        document.getElementById("action-show-incoming")?.addEventListener("click", () => {
            if (!cy || !node)
                return;
            clearHighlight();
            const directDependents = node.incomers("node");
            if (directDependents.length === 0) {
                vscode.postMessage({ command: "showInfo", text: `${className} has no incoming dependencies.` });
                clearHighlight();
                node.addClass("selected-focus-node");
                return;
            }
            activeHighlightMode = "incoming";
            node.addClass("selected-focus-node");
            directDependents.addClass("dependent-node");
            const edges = node.incomers("edge");
            const related = node.union(directDependents).union(edges);
            cy.nodes().not(node.union(directDependents)).addClass("unrelated-node");
            edges.addClass("connected-edge");
            cy.edges().not(edges).addClass("unrelated-edge");
            cy.animate({ fit: { eles: related, padding: 80 } }, { duration: 250, easing: "ease-out" });
            updateInspector(metadata);
        });
        document.getElementById("action-show-outgoing")?.addEventListener("click", () => {
            if (!cy || !node)
                return;
            clearHighlight();
            const directDependencies = node.outgoers("node");
            if (directDependencies.length === 0) {
                vscode.postMessage({ command: "showInfo", text: `${className} has no outgoing dependencies.` });
                clearHighlight();
                node.addClass("selected-focus-node");
                return;
            }
            activeHighlightMode = "outgoing";
            node.addClass("selected-focus-node");
            directDependencies.addClass("dependency-node");
            const edges = node.outgoers("edge");
            const related = node.union(directDependencies).union(edges);
            cy.nodes().not(node.union(directDependencies)).addClass("unrelated-node");
            edges.addClass("connected-edge");
            cy.edges().not(edges).addClass("unrelated-edge");
            cy.animate({ fit: { eles: related, padding: 80 } }, { duration: 250, easing: "ease-out" });
            updateInspector(metadata);
        });
        document.getElementById("action-show-entities")?.addEventListener("click", () => {
            if (!cy || !node)
                return;
            clearHighlight();
            const entities = node.outgoers("node").filter((n) => n.data("type") === "ENTITY");
            if (entities.length === 0) {
                vscode.postMessage({ command: "showInfo", text: `${className} has no entity mapping.` });
                clearHighlight();
                node.addClass("selected-focus-node");
                return;
            }
            activeHighlightMode = "entities";
            node.addClass("selected-focus-node");
            entities.addClass("dependency-node");
            const edges = node.edgesTo(entities);
            const related = node.union(entities).union(edges);
            cy.nodes().not(node.union(entities)).addClass("unrelated-node");
            edges.addClass("connected-edge");
            cy.edges().not(edges).addClass("unrelated-edge");
            cy.animate({ fit: { eles: related, padding: 80 } }, { duration: 250, easing: "ease-out" });
            updateInspector(metadata);
        });
        document.getElementById("action-trace-chain")?.addEventListener("click", () => {
            if (!cy || !node)
                return;
            clearHighlight();
            const services = node.outgoers("node").filter((n) => n.data("type") === "SERVICE");
            const repositories = services.outgoers("node").filter((n) => n.data("type") === "REPOSITORY");
            if (services.length === 0 && repositories.length === 0) {
                vscode.postMessage({ command: "showInfo", text: `${className} has no service chain trace.` });
                clearHighlight();
                node.addClass("selected-focus-node");
                return;
            }
            activeHighlightMode = "trace-chain";
            node.addClass("selected-focus-node");
            services.addClass("dependency-node");
            repositories.addClass("dependency-node");
            const edges = node.edgesTo(services).union(services.edgesTo(repositories));
            const related = node.union(services).union(repositories).union(edges);
            cy.nodes().not(node.union(services).union(repositories)).addClass("unrelated-node");
            edges.addClass("connected-edge");
            cy.edges().not(edges).addClass("unrelated-edge");
            cy.animate({ fit: { eles: related, padding: 80 } }, { duration: 250, easing: "ease-out" });
            updateInspector(metadata);
        });
        document.getElementById("action-highlight-violation")?.addEventListener("click", () => {
            if (!cy || !node)
                return;
            clearHighlight();
            const violationNodes = cy.collection();
            for (const v of nodeViolations) {
                for (const affectedFqName of v.affectedNodes) {
                    const affNode = cy.getElementById(affectedFqName);
                    if (affNode.length > 0) {
                        violationNodes.merge(affNode);
                    }
                }
            }
            if (violationNodes.length === 0) {
                vscode.postMessage({ command: "showInfo", text: `${className} has no violations to highlight.` });
                clearHighlight();
                node.addClass("selected-focus-node");
                return;
            }
            activeHighlightMode = "violation-path";
            violationNodes.addClass("violating-node");
            node.addClass("selected-focus-node");
            node.addClass("violating-node");
            const allRelated = node.union(violationNodes);
            cy.nodes().not(allRelated).addClass("unrelated-node");
            const offendingEdges = allRelated.edgesWith(allRelated);
            offendingEdges.addClass("violating-edge");
            cy.edges().not(offendingEdges).addClass("unrelated-edge");
            const violationPathEles = allRelated.union(offendingEdges);
            cy.animate({ fit: { eles: violationPathEles, padding: 80 } }, { duration: 250, easing: "ease-out" });
            offendingEdges.animate({
                style: { "width": 6 }
            }, {
                duration: 300,
                complete: () => {
                    offendingEdges.animate({
                        style: { "width": 3.5 }
                    }, { duration: 300 });
                }
            });
            updateInspector(metadata);
        });
    }
}
// Global Event listener for Clickable Chips navigation
inspectorContent.addEventListener("click", (e) => {
    const target = e.target;
    const chipId = target.closest(".clickable-chip")?.getAttribute("data-id");
    if (chipId) {
        selectNode(chipId, true);
        return;
    }
    const violationChipId = target.closest(".clickable-violation-chip")?.getAttribute("data-id");
    if (violationChipId) {
        selectNode(violationChipId, true);
    }
});
// Fit Graph Button
fitButton.addEventListener("click", () => {
    cy?.animate({ fit: { padding: 30 } }, { duration: 250, easing: "ease-in-out-cubic" });
});
// Relayout Button
relayoutButton.addEventListener("click", () => {
    applyLayout(true);
});
// Focus Selection Button
focusButton.addEventListener("click", () => {
    if (selectedNodeId && cy) {
        const node = cy.getElementById(selectedNodeId);
        if (node) {
            cy.animate({
                center: node,
            }, { duration: 250, easing: "ease-in-out-cubic" });
        }
    }
});
// Navigation Toolbar Buttons
backButton.addEventListener("click", () => {
    navigateBack();
});
forwardButton.addEventListener("click", () => {
    navigateForward();
});
// Search Feature
searchInput.addEventListener("input", () => {
    if (!cy)
        return;
    const val = searchInput.value.toLowerCase().trim();
    clearHighlight();
    if (val === "") {
        if (selectedNodeId) {
            selectNode(selectedNodeId, false);
        }
        return;
    }
    const matches = cy.nodes().filter((node) => {
        return node.data("label").toLowerCase().includes(val);
    });
    cy.elements().addClass("dimmed-hover");
    matches.removeClass("dimmed-hover").addClass("highlighted-node");
    matches.connectedEdges().removeClass("dimmed-hover");
    if (matches.length > 1) {
        cy.animate({
            fit: { eles: matches, padding: 100 },
        }, { duration: 300, easing: "ease-out" });
    }
    else if (matches.length === 1) {
        const matchNode = matches[0];
        const pos = matchNode.position();
        const extent = cy.extent();
        const w = extent.x2 - extent.x1;
        const h = extent.y2 - extent.y1;
        const xPad = w * 0.325;
        const yPad = h * 0.325;
        const comfortablyVisible = pos.x >= extent.x1 + xPad && pos.x <= extent.x2 - xPad &&
            pos.y >= extent.y1 + yPad && pos.y <= extent.y2 - yPad;
        if (!comfortablyVisible) {
            const container = cy.container();
            const containerHeight = container ? container.clientHeight : 600;
            const currentZoom = cy.zoom();
            const panX = lastValidWidth / 2 - pos.x * currentZoom;
            const panY = containerHeight / 2 - pos.y * currentZoom;
            cy.animate({
                pan: { x: panX, y: panY },
            }, { duration: 300, easing: "ease-out" });
        }
    }
});
// Enter key in search input
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && cy) {
        const val = searchInput.value.toLowerCase().trim();
        const matches = cy.nodes().filter((node) => {
            return node.data("label").toLowerCase().includes(val);
        });
        if (matches.length > 0) {
            const matchNode = matches[0];
            selectNode(matchNode.id(), true);
        }
    }
});
// Space key and Alt+Left / Alt+Right Shortcuts
window.addEventListener("keydown", (e) => {
    if (e.altKey && e.key === "ArrowLeft") {
        e.preventDefault();
        navigateBack();
    }
    else if (e.altKey && e.key === "ArrowRight") {
        e.preventDefault();
        navigateForward();
    }
    else if (e.code === "Space" && document.activeElement !== searchInput) {
        e.preventDefault();
        cy?.animate({ fit: { padding: 30 } }, { duration: 250, easing: "ease-in-out-cubic" });
    }
    else if (e.key === "Escape") {
        e.preventDefault();
        deselectNode();
    }
});
// Filter Feature (Task 2)
const filterSelect = document.getElementById("filter-select");
if (filterSelect) {
    filterSelect.addEventListener("change", () => {
        applyFilter();
    });
}
function applyFilter() {
    if (!cy)
        return;
    const filterVal = filterSelect.value;
    clearHighlight();
    // Clear any existing filtered-out class
    cy.elements().removeClass("filtered-out");
    if (filterVal === "all") {
        return;
    }
    // Hide nodes that do not match the filter
    cy.nodes().each((node) => {
        const type = node.data("type");
        const fqName = node.id();
        const nodeViolations = graphData.violations.filter((v) => v.affectedNodes.includes(fqName));
        const hasViolations = nodeViolations.length > 0;
        let matches = false;
        switch (filterVal) {
            case "controllers":
                matches = type === "CONTROLLER";
                break;
            case "services":
                matches = type === "SERVICE";
                break;
            case "repositories":
                matches = type === "REPOSITORY";
                break;
            case "entities":
                matches = type === "ENTITY";
                break;
            case "violations":
                matches = hasViolations;
                break;
            case "healthy":
                matches = !hasViolations;
                break;
            case "circular":
                matches = nodeViolations.some(v => v.type === "CIRCULAR_DEPENDENCY");
                break;
            case "unused":
                matches = nodeViolations.some(v => v.type === "UNUSED_SERVICE");
                break;
            case "layer":
                matches = nodeViolations.some(v => v.type === "BYPASS_SERVICE");
                break;
        }
        if (!matches) {
            node.addClass("filtered-out");
            node.connectedEdges().addClass("filtered-out");
        }
    });
}
