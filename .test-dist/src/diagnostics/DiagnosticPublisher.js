import * as vscode from "vscode";
import { DiagnosticMapper } from "./DiagnosticMapper";
/**
 * DiagnosticPublisher manages the VS Code DiagnosticCollection state,
 * publishing and clearing diagnostics derived from analysis violations.
 */
export class DiagnosticPublisher {
    constructor() {
        this.collection = vscode.languages.createDiagnosticCollection("codeatlas");
        this.mapper = new DiagnosticMapper();
    }
    /**
     * Clears old diagnostics and publishes new violations to the Problems panel.
     * @param violations Array of detected violations.
     */
    publish(violations) {
        this.collection.clear();
        const grouped = new Map();
        for (const violation of violations) {
            if (!violation.sourceFilePath) {
                continue;
            }
            const diagnostic = this.mapper.map(violation);
            if (!grouped.has(violation.sourceFilePath)) {
                grouped.set(violation.sourceFilePath, []);
            }
            grouped.get(violation.sourceFilePath).push(diagnostic);
        }
        for (const [filePath, diagnostics] of grouped.entries()) {
            const uri = vscode.Uri.file(filePath);
            this.collection.set(uri, diagnostics);
        }
    }
    /**
     * Clears all diagnostics.
     */
    clear() {
        this.collection.clear();
    }
    /**
     * Disposes the underlying collection resource.
     */
    dispose() {
        this.collection.dispose();
    }
}
