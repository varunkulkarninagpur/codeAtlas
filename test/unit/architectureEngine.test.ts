import * as assert from "assert";
import { ArchitectureGraph } from "../../src/engine/ArchitectureGraph";
import { ArchitectureEngine } from "../../src/engine/ArchitectureEngine";
import { LayerViolationRule } from "../../src/engine/rules/LayerViolationRule";
import { IArchitectureRule } from "../../src/engine/rules/IArchitectureRule";
import { JavaClass } from "../../src/common/types";

describe("ArchitectureEngine & LayerViolationRule Tests", () => {
  const createMockClass = (className: string, type: JavaClass["type"]): JavaClass => {
    return {
      filePath: `/path/to/${className}.java`,
      packageName: "com.example.demo",
      className,
      fullyQualifiedName: `com.example.demo.${className}`,
      type,
      baseTypes: [],
      dependencies: [],
      imports: [],
    };
  };

  it("should execute multiple rules and merge all violations", () => {
    const graph = new ArchitectureGraph();
    const mockRule1: IArchitectureRule = {
      analyze: () => [
        {
          id: "rule1",
          type: "BYPASS_SERVICE",
          message: "Error 1",
          severity: "ERROR",
          affectedNodes: [],
        },
      ],
    };
    const mockRule2: IArchitectureRule = {
      analyze: () => [
        {
          id: "rule2",
          type: "CIRCULAR_DEPENDENCY",
          message: "Error 2",
          severity: "ERROR",
          affectedNodes: [],
        },
      ],
    };

    const engine = new ArchitectureEngine([mockRule1, mockRule2]);
    const violations = engine.analyze(graph);

    assert.strictEqual(violations.length, 2);
    assert.strictEqual(violations[0].id, "rule1");
    assert.strictEqual(violations[1].id, "rule2");
  });

  it("should flag a direct Controller to Repository dependency as a violation", () => {
    const graph = new ArchitectureGraph();
    const controller = createMockClass("UserController", "CONTROLLER");
    const repository = createMockClass("UserRepository", "REPOSITORY");

    graph.addComponent(controller);
    graph.addComponent(repository);
    graph.connect(controller.fullyQualifiedName, repository.fullyQualifiedName);

    const engine = new ArchitectureEngine([new LayerViolationRule()]);
    const violations = engine.analyze(graph);

    assert.strictEqual(violations.length, 1);
    assert.strictEqual(violations[0].type, "BYPASS_SERVICE");
    assert.ok(violations[0].message.includes("Controller 'UserController' directly depends on Repository 'UserRepository'"));
  });

  it("should not flag indirect Controller -> Service -> Repository connections as violations", () => {
    const graph = new ArchitectureGraph();
    const controller = createMockClass("UserController", "CONTROLLER");
    const service = createMockClass("UserService", "SERVICE");
    const repository = createMockClass("UserRepository", "REPOSITORY");

    graph.addComponent(controller);
    graph.addComponent(service);
    graph.addComponent(repository);

    // Controller -> Service
    graph.connect(controller.fullyQualifiedName, service.fullyQualifiedName);
    // Service -> Repository
    graph.connect(service.fullyQualifiedName, repository.fullyQualifiedName);

    const engine = new ArchitectureEngine([new LayerViolationRule()]);
    const violations = engine.analyze(graph);

    assert.strictEqual(violations.length, 0);
  });

  it("should calculate health score deterministically with correct deductions for each violation type", () => {
    const engine = new ArchitectureEngine([]);
    const violations = [
      {
        id: "v1",
        type: "BYPASS_SERVICE" as const,
        message: "Layer bypass",
        severity: "ERROR" as const,
        affectedNodes: [],
      },
      {
        id: "v2",
        type: "CIRCULAR_DEPENDENCY" as const,
        message: "Cycle",
        severity: "ERROR" as const,
        affectedNodes: [],
      },
      {
        id: "v3",
        type: "UNUSED_SERVICE" as const,
        message: "Unused",
        severity: "WARNING" as const,
        affectedNodes: [],
      },
    ];

    const health = engine.calculateHealthScore(violations);
    // 100 - 10 (bypass) - 15 (circular) - 5 (unused) = 70
    assert.strictEqual(health.score, 70);
    assert.strictEqual(health.explanations.length, 4);
    assert.ok(health.explanations.includes("Base Score: 100"));
    assert.ok(health.explanations.includes("Layer Violations: -10 (1 issues)"));
    assert.ok(health.explanations.includes("Circular Dependencies: -15 (1 issues)"));
    assert.ok(health.explanations.includes("Unused Services: -5 (1 issues)"));
  });
});
