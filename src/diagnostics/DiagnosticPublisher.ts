import * as vscode from "vscode";
import { ArchitectureViolation } from "../common/types";
import { DiagnosticMapper } from "./DiagnosticMapper";

/**
 * DiagnosticPublisher manages the VS Code DiagnosticCollection state,
 * publishing and clearing diagnostics derived from analysis violations.
 */
export class DiagnosticPublisher implements vscode.Disposable {
  private collection: vscode.DiagnosticCollection;
  private mapper: DiagnosticMapper;

  constructor() {
    this.collection = vscode.languages.createDiagnosticCollection("codeatlas");
    this.mapper = new DiagnosticMapper();
  }

  /**
   * Clears old diagnostics and publishes new violations to the Problems panel.
   * @param violations Array of detected violations.
   */
  public publish(violations: ArchitectureViolation[]): void {
    this.collection.clear();

    const grouped = new Map<string, vscode.Diagnostic[]>();

    for (const violation of violations) {
      if (!violation.sourceFilePath) {
        continue;
      }
      const diagnostic = this.mapper.map(violation);
      if (!grouped.has(violation.sourceFilePath)) {
        grouped.set(violation.sourceFilePath, []);
      }
      grouped.get(violation.sourceFilePath)!.push(diagnostic);
    }

    for (const [filePath, diagnostics] of grouped.entries()) {
      const uri = vscode.Uri.file(filePath);
      this.collection.set(uri, diagnostics);
    }
  }

  /**
   * Clears all diagnostics.
   */
  public clear(): void {
    this.collection.clear();
  }

  /**
   * Disposes the underlying collection resource.
   */
  public dispose(): void {
    this.collection.dispose();
  }
}
