import * as assert from "assert";
import { ArchitectureGraph } from "../../src/engine/ArchitectureGraph";
import { CircularDependencyRule } from "../../src/engine/rules/CircularDependencyRule";
import { JavaClass, RelationshipType } from "../../src/common/types";

describe("CircularDependencyRule Tests", () => {
  let graph: ArchitectureGraph;
  let rule: CircularDependencyRule;

  const createMockClass = (className: string, packageName = "com.example"): JavaClass => {
    const fqName = packageName ? `${packageName}.${className}` : className;
    return {
      filePath: `/path/to/${className}.java`,
      packageName,
      className,
      fullyQualifiedName: fqName,
      type: "CLASS",
      baseTypes: [],
      dependencies: [],
      imports: [],
    };
  };

  beforeEach(() => {
    graph = new ArchitectureGraph();
    rule = new CircularDependencyRule();
  });

  it("should return no violations for a graph with no cycles", () => {
    const a = createMockClass("A");
    const b = createMockClass("B");
    const c = createMockClass("C");

    graph.addComponent(a);
    graph.addComponent(b);
    graph.addComponent(c);

    graph.connect(a.fullyQualifiedName, b.fullyQualifiedName, RelationshipType.DEPENDENCY);
    graph.connect(b.fullyQualifiedName, c.fullyQualifiedName, RelationshipType.DEPENDENCY);

    const violations = rule.analyze(graph);
    assert.strictEqual(violations.length, 0);
  });

  it("should detect a single cycle and report it with a readable path", () => {
    const a = createMockClass("A");
    const b = createMockClass("B");
    const c = createMockClass("C");

    graph.addComponent(a);
    graph.addComponent(b);
    graph.addComponent(c);

    graph.connect(a.fullyQualifiedName, b.fullyQualifiedName, RelationshipType.DEPENDENCY);
    graph.connect(b.fullyQualifiedName, c.fullyQualifiedName, RelationshipType.DEPENDENCY);
    graph.connect(c.fullyQualifiedName, a.fullyQualifiedName, RelationshipType.DEPENDENCY);

    const violations = rule.analyze(graph);
    assert.strictEqual(violations.length, 1);
    const v = violations[0];
    assert.strictEqual(v.type, "CIRCULAR_DEPENDENCY");
    assert.strictEqual(v.severity, "ERROR");
    assert.ok(v.message.includes("A\n→ B\n→ C\n→ A"));
    assert.deepStrictEqual(v.affectedNodes, [a.fullyQualifiedName, b.fullyQualifiedName, c.fullyQualifiedName]);
  });

  it("should detect multiple independent cycles", () => {
    const a = createMockClass("A");
    const b = createMockClass("B");
    const c = createMockClass("C");
    const d = createMockClass("D");

    graph.addComponent(a);
    graph.addComponent(b);
    graph.addComponent(c);
    graph.addComponent(d);

    // Cycle 1: A -> B -> A
    graph.connect(a.fullyQualifiedName, b.fullyQualifiedName, RelationshipType.DEPENDENCY);
    graph.connect(b.fullyQualifiedName, a.fullyQualifiedName, RelationshipType.DEPENDENCY);

    // Cycle 2: C -> D -> C
    graph.connect(c.fullyQualifiedName, d.fullyQualifiedName, RelationshipType.DEPENDENCY);
    graph.connect(d.fullyQualifiedName, c.fullyQualifiedName, RelationshipType.DEPENDENCY);

    const violations = rule.analyze(graph);
    assert.strictEqual(violations.length, 2);

    const types = violations.map(v => v.type);
    assert.deepStrictEqual(types, ["CIRCULAR_DEPENDENCY", "CIRCULAR_DEPENDENCY"]);
  });

  it("should return no violations for a large Directed Acyclic Graph (DAG)", () => {
    // Build a larger tree-like graph
    const nodes: JavaClass[] = [];
    for (let i = 0; i < 20; i++) {
      const node = createMockClass(`Node${i}`);
      nodes.push(node);
      graph.addComponent(node);
    }

    // Connect node[i] -> node[2*i + 1] and node[2*i + 2] (binary tree DAG)
    for (let i = 0; i < 9; i++) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      graph.connect(nodes[i].fullyQualifiedName, nodes[left].fullyQualifiedName, RelationshipType.DEPENDENCY);
      graph.connect(nodes[i].fullyQualifiedName, nodes[right].fullyQualifiedName, RelationshipType.DEPENDENCY);
    }

    const violations = rule.analyze(graph);
    assert.strictEqual(violations.length, 0);
  });

  it("should NOT report violations for JPA bidirectional ORM relationships", () => {
    // Replicates real Shopizer pattern: Product @OneToMany ProductDescription
    const product = createMockClass("Product");
    const productDesc = createMockClass("ProductDescription");
    const country = createMockClass("Country");
    const countryDesc = createMockClass("CountryDescription");

    graph.addComponent(product);
    graph.addComponent(productDesc);
    graph.addComponent(country);
    graph.addComponent(countryDesc);

    // Bidirectional ORM mappings — must NOT trigger circular dependency violations
    graph.connect(product.fullyQualifiedName, productDesc.fullyQualifiedName, RelationshipType.ORM_RELATIONSHIP);
    graph.connect(productDesc.fullyQualifiedName, product.fullyQualifiedName, RelationshipType.ORM_RELATIONSHIP);
    graph.connect(country.fullyQualifiedName, countryDesc.fullyQualifiedName, RelationshipType.ORM_RELATIONSHIP);
    graph.connect(countryDesc.fullyQualifiedName, country.fullyQualifiedName, RelationshipType.ORM_RELATIONSHIP);

    const violations = rule.analyze(graph);
    assert.strictEqual(violations.length, 0, "ORM bidirectional cycles must not be reported as architectural violations");
  });

  it("should still detect genuine DEPENDENCY cycles even when ORM cycles exist in the same graph", () => {
    const serviceA = createMockClass("OrderService");
    const serviceB = createMockClass("PaymentService");
    const entity = createMockClass("Order");
    const entityDesc = createMockClass("OrderDescription");

    graph.addComponent(serviceA);
    graph.addComponent(serviceB);
    graph.addComponent(entity);
    graph.addComponent(entityDesc);

    // Genuine service coupling cycle
    graph.connect(serviceA.fullyQualifiedName, serviceB.fullyQualifiedName, RelationshipType.DEPENDENCY);
    graph.connect(serviceB.fullyQualifiedName, serviceA.fullyQualifiedName, RelationshipType.DEPENDENCY);

    // ORM back-reference — must be invisible to rule
    graph.connect(entity.fullyQualifiedName, entityDesc.fullyQualifiedName, RelationshipType.ORM_RELATIONSHIP);
    graph.connect(entityDesc.fullyQualifiedName, entity.fullyQualifiedName, RelationshipType.ORM_RELATIONSHIP);

    const violations = rule.analyze(graph);
    assert.strictEqual(violations.length, 1);
    assert.strictEqual(violations[0].type, "CIRCULAR_DEPENDENCY");
    assert.ok(violations[0].affectedNodes.includes(serviceA.fullyQualifiedName));
    assert.ok(violations[0].affectedNodes.includes(serviceB.fullyQualifiedName));
  });
});
