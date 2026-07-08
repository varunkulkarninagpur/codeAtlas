import * as assert from "assert";
import { ArchitectureGraph } from "../../src/engine/ArchitectureGraph";
import { JavaClass, RelationshipType } from "../../src/common/types";

describe("ArchitectureGraph Tests", () => {
  let graph: ArchitectureGraph;

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
  });

  it("should add and retrieve components by ID", () => {
    const component = createMockClass("UserController");
    graph.addComponent(component);

    const retrieved = graph.getComponent("com.example.UserController");
    assert.deepStrictEqual(retrieved, component);
  });

  it("should establish connections and traverse incoming/outgoing relationships", () => {
    const controller = createMockClass("UserController");
    const service = createMockClass("UserService");

    graph.addComponent(controller);
    graph.addComponent(service);

    graph.connect("com.example.UserController", "com.example.UserService", RelationshipType.DEPENDENCY);

    assert.deepStrictEqual(graph.getOutgoing("com.example.UserController"), ["com.example.UserService"]);
    assert.deepStrictEqual(graph.getIncoming("com.example.UserService"), ["com.example.UserController"]);
  });

  it("should not connect components if source or target node is missing", () => {
    const controller = createMockClass("UserController");
    graph.addComponent(controller);

    graph.connect("com.example.UserController", "com.example.UserService"); // Target does not exist in graph

    assert.deepStrictEqual(graph.getOutgoing("com.example.UserController"), []);
  });

  it("should detect simple and complex circular dependencies", () => {
    const a = createMockClass("A");
    const b = createMockClass("B");
    const c = createMockClass("C");

    graph.addComponent(a);
    graph.addComponent(b);
    graph.addComponent(c);

    // Create cycle: A -> B -> C -> A
    graph.connect("com.example.A", "com.example.B", RelationshipType.DEPENDENCY);
    graph.connect("com.example.B", "com.example.C", RelationshipType.DEPENDENCY);
    graph.connect("com.example.C", "com.example.A", RelationshipType.DEPENDENCY);

    const cycles = graph.findCycles();
    assert.strictEqual(cycles.length, 1);
    assert.deepStrictEqual(cycles[0], ["com.example.A", "com.example.B", "com.example.C"]);
  });

  it("should return an empty list of cycles for a DAG (directed acyclic graph)", () => {
    const a = createMockClass("A");
    const b = createMockClass("B");
    const c = createMockClass("C");

    graph.addComponent(a);
    graph.addComponent(b);
    graph.addComponent(c);

    // A -> B -> C
    graph.connect("com.example.A", "com.example.B", RelationshipType.DEPENDENCY);
    graph.connect("com.example.B", "com.example.C", RelationshipType.DEPENDENCY);

    const cycles = graph.findCycles();
    assert.deepStrictEqual(cycles, []);
  });

  it("should store and return correct edge type via getEdgeType()", () => {
    const product = createMockClass("Product");
    const desc = createMockClass("ProductDescription");
    const service = createMockClass("ProductService");

    graph.addComponent(product);
    graph.addComponent(desc);
    graph.addComponent(service);

    graph.connect("com.example.Product", "com.example.ProductDescription", RelationshipType.ORM_RELATIONSHIP);
    graph.connect("com.example.Product", "com.example.ProductService", RelationshipType.DEPENDENCY);

    assert.strictEqual(graph.getEdgeType("com.example.Product", "com.example.ProductDescription"), RelationshipType.ORM_RELATIONSHIP);
    assert.strictEqual(graph.getEdgeType("com.example.Product", "com.example.ProductService"), RelationshipType.DEPENDENCY);
    assert.strictEqual(graph.getEdgeType("com.example.ProductDescription", "com.example.Product"), undefined);
  });

  it("should filter getOutgoing() by EdgeQuery relationship type", () => {
    const entity = createMockClass("Order");
    const lineItem = createMockClass("OrderLineItem");
    const service = createMockClass("OrderService");

    graph.addComponent(entity);
    graph.addComponent(lineItem);
    graph.addComponent(service);

    graph.connect("com.example.Order", "com.example.OrderLineItem", RelationshipType.ORM_RELATIONSHIP);
    graph.connect("com.example.Order", "com.example.OrderService", RelationshipType.DEPENDENCY);

    const depOnly = graph.getOutgoing("com.example.Order", { types: [RelationshipType.DEPENDENCY] });
    assert.deepStrictEqual(depOnly, ["com.example.OrderService"]);

    const ormOnly = graph.getOutgoing("com.example.Order", { types: [RelationshipType.ORM_RELATIONSHIP] });
    assert.deepStrictEqual(ormOnly, ["com.example.OrderLineItem"]);

    const all = graph.getOutgoing("com.example.Order");
    assert.strictEqual(all.length, 2);
  });

  it("should filter getIncoming() by EdgeQuery relationship type", () => {
    const repo = createMockClass("ProductRepository");
    const service = createMockClass("ProductService");
    const entity = createMockClass("ProductAudit");

    graph.addComponent(repo);
    graph.addComponent(service);
    graph.addComponent(entity);

    graph.connect("com.example.ProductService", "com.example.ProductRepository", RelationshipType.DEPENDENCY);
    graph.connect("com.example.ProductAudit", "com.example.ProductRepository", RelationshipType.ORM_RELATIONSHIP);

    const depSources = graph.getIncoming("com.example.ProductRepository", { types: [RelationshipType.DEPENDENCY] });
    assert.deepStrictEqual(depSources, ["com.example.ProductService"]);

    const allSources = graph.getIncoming("com.example.ProductRepository");
    assert.strictEqual(allSources.length, 2);
  });

  it("should NOT detect ORM bidirectional cycles when filtering by DEPENDENCY", () => {
    // Simulates: Product @OneToMany ProductDescription, ProductDescription @ManyToOne Product
    const product = createMockClass("Product");
    const desc = createMockClass("ProductDescription");

    graph.addComponent(product);
    graph.addComponent(desc);

    graph.connect("com.example.Product", "com.example.ProductDescription", RelationshipType.ORM_RELATIONSHIP);
    graph.connect("com.example.ProductDescription", "com.example.Product", RelationshipType.ORM_RELATIONSHIP);

    // Unfiltered — should detect a cycle
    const allCycles = graph.findCycles();
    assert.strictEqual(allCycles.length, 1);

    // DEPENDENCY-filtered — must NOT detect it (ORM cycles are expected ORM patterns)
    const depCycles = graph.findCycles({ types: [RelationshipType.DEPENDENCY, RelationshipType.INHERITANCE] });
    assert.strictEqual(depCycles.length, 0);
  });

  it("should detect genuine service DEPENDENCY cycles while ignoring ORM edges", () => {
    const a = createMockClass("ServiceA");
    const b = createMockClass("ServiceB");
    const entity = createMockClass("MyEntity");

    graph.addComponent(a);
    graph.addComponent(b);
    graph.addComponent(entity);

    // Real circular coupling between services
    graph.connect("com.example.ServiceA", "com.example.ServiceB", RelationshipType.DEPENDENCY);
    graph.connect("com.example.ServiceB", "com.example.ServiceA", RelationshipType.DEPENDENCY);
    // ORM back-reference — must NOT be included in cycle detection
    graph.connect("com.example.ServiceA", "com.example.MyEntity", RelationshipType.ORM_RELATIONSHIP);
    graph.connect("com.example.MyEntity", "com.example.ServiceA", RelationshipType.ORM_RELATIONSHIP);

    const depCycles = graph.findCycles({ types: [RelationshipType.DEPENDENCY, RelationshipType.INHERITANCE] });
    // Only the ServiceA <-> ServiceB cycle must appear
    assert.strictEqual(depCycles.length, 1);
    assert.ok(depCycles[0].includes("com.example.ServiceA"));
    assert.ok(depCycles[0].includes("com.example.ServiceB"));
    assert.ok(!depCycles[0].includes("com.example.MyEntity"));
  });
});
