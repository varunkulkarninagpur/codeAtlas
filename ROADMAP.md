# CodeAtlas Release Roadmap

This document outlines the development milestones and future feature roadmap for CodeAtlas.

---

## v1.0.0 (Current Release) - Launch Baseline
*   **Static AST Parsing & Component Extraction**: Stable parser and semantic extractor for Java source code mapping Class, Interface, Record, and Enum component models.
*   **Recursive Interface Resolution**: Walks up nested interface chains to automatically resolve repository classifications (supporting custom base repositories).
*   **Typed Relationship Graph**: Builds a queryable directed graph with classified edge semantics (`DEPENDENCY`, `INHERITANCE`, `ORM_RELATIONSHIP`).
*   **Architectural Validation Engine**: Rules for Layer Violations (bypassing service layer), Circular Dependency loops, and Unused Services.
*   **Developer Visual UI**: Native sidebar tree view dashboard with health scoring, inline diagnostics, and interactive Cytoscape.js dependency visualizer.
*   **Conformance Suite**: Portable regression test suite with 49 custom Java fixtures.

---

## v1.1.0 - Custom Configuration & UI Enhancements
*   **Project Config overrides (`codeatlas.json`)**: Let teams configure custom package layers, exclude lists (e.g., test classes, mock utilities), and adjust rule scoring weights.
*   **Visualizer Filter Toggles**: Add interactive check-boxes to Cytoscape Webview to show/hide `ORM_RELATIONSHIP` or `INHERITANCE` edges on demand.
*   **Search & Node Highlighting**: Add search capability inside the Cytoscape visualizer to focus and zoom in on specific components.
*   **Expanded Spring/JPA Parsing**: Support configuration property references and custom method-level beans.

---

## v1.2.0 - Reactor Submodules & Data Flow
*   **Multi-Module Maven/Gradle Support**: Group components visually inside Cytoscape layout based on their parent reactor submodules.
*   **REST Endpoint Extraction**: Parse mapping annotations (`@GetMapping`, `@PostMapping`, etc.) to map incoming API endpoints to Controllers, visualizing entry-to-database flows.
*   **Export Capabilities**: Support exporting the Cytoscape canvas to PNG, SVG, or JSON graph models.

---

## v2.0.0 - LSP & Extensibility
*   **LSP Port**: Package the analyzer engine into a Language Server Protocol (LSP) backend, enabling CodeAtlas support in other editors (e.g. IntelliJ, NeoVim).
*   **Kotlin Parsing Support**: Add a Kotlin parser to extend semantic components and edge extraction to Kotlin-based Spring Boot codebases.
*   **Extensible Rule Plugins**: Allow developers to write and load custom TS/JS scripts as validation rules.
*   **Headless CLI**: Release a standalone CLI tool that can run inside CI/CD runners to break build pipelines on architecture violations.
