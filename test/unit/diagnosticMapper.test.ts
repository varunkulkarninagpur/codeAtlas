import * as assert from "assert";
import * as Module from "module";

// Mock vscode APIs for node-based unit tests
class MockRange {
  public startLine: number;
  public startChar: number;
  public endLine: number;
  public endChar: number;

  constructor(startLine: number, startChar: number, endLine: number, endChar: number) {
    this.startLine = startLine;
    this.startChar = startChar;
    this.endLine = endLine;
    this.endChar = endChar;
  }
}

const MockDiagnosticSeverity = {
  Error: 0,
  Warning: 1,
};

class MockDiagnostic {
  public range: MockRange;
  public message: string;
  public severity: number;
  public code?: string;
  public source?: string;

  constructor(range: MockRange, message: string, severity: number) {
    this.range = range;
    this.message = message;
    this.severity = severity;
  }
}

const mockVscode = {
  Range: MockRange,
  DiagnosticSeverity: MockDiagnosticSeverity,
  Diagnostic: MockDiagnostic,
};

const originalRequire = Module.prototype.require;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Module.prototype.require = function (this: any, id: string, ...args: any[]) {
  if (id === "vscode") {
    return mockVscode;
  }
  return (originalRequire as any).apply(this, [id, ...args]);
};

import { DiagnosticMapper } from "../../src/diagnostics/DiagnosticMapper";
import { ArchitectureViolation } from "../../src/common/types";

describe("DiagnosticMapper Tests", () => {
  let mapper: DiagnosticMapper;

  beforeEach(() => {
    mapper = new DiagnosticMapper();
  });

  it("should correctly map an error ArchitectureViolation to a vscode Diagnostic", () => {
    const violation: ArchitectureViolation = {
      id: "v1",
      type: "BYPASS_SERVICE",
      message: "Controller directly depends on Repository",
      severity: "ERROR",
      affectedNodes: [],
      sourceLineNumber: 10,
    };

    const diagnostic = mapper.map(violation) as any;

    assert.strictEqual(diagnostic.message, "Controller directly depends on Repository");
    // Range line is 0-indexed, so line 10 becomes line 9
    assert.strictEqual(diagnostic.range.startLine, 9);
    assert.strictEqual(diagnostic.severity, MockDiagnosticSeverity.Error);
    assert.strictEqual(diagnostic.code, "BYPASS_SERVICE");
    assert.strictEqual(diagnostic.source, "CodeAtlas");
  });

  it("should default to line 1 (0-indexed line 0) if sourceLineNumber is not provided", () => {
    const violation: ArchitectureViolation = {
      id: "v2",
      type: "CIRCULAR_DEPENDENCY",
      message: "Circular dependency detected",
      severity: "WARNING",
      affectedNodes: [],
    };

    const diagnostic = mapper.map(violation) as any;

    assert.strictEqual(diagnostic.range.startLine, 0);
    assert.strictEqual(diagnostic.severity, MockDiagnosticSeverity.Warning);
  });
});
