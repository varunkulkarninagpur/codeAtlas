# Changelog

All notable changes to the CodeAtlas project will be documented in this file.

## [1.0.0] - 2026-07-07
### Added
- **Core Semantic Analysis Engine**: Integrated fast AST parser and component type extractor for Spring Boot Java structures.
- **Inheritance Resolution**: Added recursive `ComponentTypeResolver` allowing repository inference from deep interface lineage (for example, custom repository bases).
- **Typed Graph Architecture**: Migrated graph model to semantically classified relationships (`DEPENDENCY`, `INHERITANCE`, `ORM_RELATIONSHIP`).
- **Health Score and Rules Evaluator**: Formulated custom rules for Layer Violations (Error, -10), Circular Dependencies (Error, -15), and Unused Services (Warning, -5).
- **VS Code UI**: Fully integrated sidebar statistics dashboard, inline diagnostic warnings, and Cytoscape.js interactive graph webview.
- **Validation and Conformance Framework**: Implemented validation scripts (`validate-repo`, `validate-parser`) and a conformance suite with 49 Java fixtures.

## [0.1.0] - 2026-07-05
### Added
- Initial project structure bootstrapping.
- Basic extension activation and "CodeAtlas: Analyze Project" command registration.
