import * as vscode from "vscode";
import { ArchitectureViolation } from "../common/types";

/**
 * DiagnosticMapper is responsible for converting domain-specific ArchitectureViolations
 * into VS Code native Diagnostic structures.
 */
export class DiagnosticMapper {
  /**
   * Maps an ArchitectureViolation to a vscode.Diagnostic using precise SourceLocation mapping.
   * @param violation The source violation.
   * @returns The mapped VS Code Diagnostic.
   */
  public map(violation: ArchitectureViolation): vscode.Diagnostic {
    const loc = violation.location;
    
    // Convert 1-indexed line/column to 0-indexed VS Code values
    const startLine = loc ? loc.line - 1 : (violation.sourceLineNumber ?? 1) - 1;
    const startCol = loc ? loc.column - 1 : 0;
    
    // Highlight a sensible token width (e.g., 40 characters) at the exact position
    const range = new vscode.Range(startLine, startCol, startLine, startCol + 40);

    const severity = violation.severity === "ERROR"
      ? vscode.DiagnosticSeverity.Error
      : vscode.DiagnosticSeverity.Warning;

    const diagnostic = new vscode.Diagnostic(range, violation.message, severity);
    diagnostic.code = violation.type;
    diagnostic.source = "CodeAtlas";

    return diagnostic;
  }
}
