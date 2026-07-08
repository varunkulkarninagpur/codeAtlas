import * as assert from "assert";
import { ArchitectureGraph } from "../../src/engine/ArchitectureGraph";
import { UnusedServiceRule } from "../../src/engine/rules/UnusedServiceRule";
import { JavaClass } from "../../src/common/types";

describe("UnusedServiceRule Tests", () => {
  let graph: ArchitectureGraph;
  let rule: UnusedServiceRule;

  const createMockClass = (className: string, type: "CONTROLLER" | "SERVICE" | "REPOSITORY" | "ENTITY" | "CLASS" = "CLASS", packageName = "com.example"): JavaClass => {
    const fqName = packageName ? `${packageName}.${className}` : className;
    return {
      filePath: `/path/to/${className}.java`,
      packageName,
      className,
      fullyQualifiedName: fqName,
      type,
      baseTypes: [],
      dependencies: [],
      imports: [],
    };
  };

  beforeEach(() => {
    graph = new ArchitectureGraph();
    rule = new UnusedServiceRule();
  });

  it("should not report a service that is used by another component", () => {
    const controller = createMockClass("UserController", "CONTROLLER");
    const service = createMockClass("UserService", "SERVICE");

    graph.addComponent(controller);
    graph.addComponent(service);

    graph.connect(controller.fullyQualifiedName, service.fullyQualifiedName);

    const violations = rule.analyze(graph);
    assert.strictEqual(violations.length, 0);
  });

  it("should report a service that is not referenced by any other component", () => {
    const service = createMockClass("EmailService", "SERVICE");
    graph.addComponent(service);

    const violations = rule.analyze(graph);
    assert.strictEqual(violations.length, 1);
    
    const v = violations[0];
    assert.strictEqual(v.type, "UNUSED_SERVICE");
    assert.strictEqual(v.severity, "WARNING");
    assert.strictEqual(v.message, "Service 'EmailService' is not referenced by any other component.");
    assert.deepStrictEqual(v.affectedNodes, [service.fullyQualifiedName]);
  });

  it("should report multiple unused services", () => {
    const service1 = createMockClass("EmailService", "SERVICE");
    const service2 = createMockClass("SmsService", "SERVICE");
    const service3 = createMockClass("PaymentService", "SERVICE");

    graph.addComponent(service1);
    graph.addComponent(service2);
    graph.addComponent(service3);

    const violations = rule.analyze(graph);
    assert.strictEqual(violations.length, 3);

    const affected = violations.map(v => v.affectedNodes[0]);
    assert.ok(affected.includes(service1.fullyQualifiedName));
    assert.ok(affected.includes(service2.fullyQualifiedName));
    assert.ok(affected.includes(service3.fullyQualifiedName));
  });

  it("should handle large graphs with mixed used and unused services", () => {
    const controller = createMockClass("MainController", "CONTROLLER");
    graph.addComponent(controller);

    // Create 50 services, odd ones are used, even ones are unused
    for (let i = 0; i < 50; i++) {
      const service = createMockClass(`Service${i}`, "SERVICE");
      graph.addComponent(service);

      if (i % 2 !== 0) {
        // Connect controller -> service
        graph.connect(controller.fullyQualifiedName, service.fullyQualifiedName);
      }
    }

    const violations = rule.analyze(graph);
    // There should be exactly 25 unused services (the even index ones)
    assert.strictEqual(violations.length, 25);

    for (const v of violations) {
      assert.strictEqual(v.type, "UNUSED_SERVICE");
      assert.strictEqual(v.severity, "WARNING");
    }
  });
});
