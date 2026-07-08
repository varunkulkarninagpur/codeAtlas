import * as assert from "assert";
import * as path from "path";
import * as fs from "fs";
import { AnalysisPipeline } from "../../src/pipeline/AnalysisPipeline";
import { ArchitectureEngine } from "../../src/engine/ArchitectureEngine";
import { LayerViolationRule } from "../../src/engine/rules/LayerViolationRule";
import { CircularDependencyRule } from "../../src/engine/rules/CircularDependencyRule";
import { UnusedServiceRule } from "../../src/engine/rules/UnusedServiceRule";

describe("E2E Validation Suite (External Repositories)", function () {
  // Parsing large codebases can take time, so we set a generous timeout
  this.timeout(30000);

  const dummyLogger = {
    info: () => {},
    warn: () => {},
    error: () => {},
  };

  const engine = new ArchitectureEngine([
    new LayerViolationRule(),
    new CircularDependencyRule(),
    new UnusedServiceRule(),
  ]);

  it("should validate Spring PetClinic if present", async function () {
    const repoPath = path.resolve(__dirname, "../../examples/spring-petclinic");
    if (!fs.existsSync(repoPath)) {
      console.log(`[INFO] Spring PetClinic not found at ${repoPath}. Skipping E2E test.`);
      this.skip();
      return;
    }

    const pipeline = new AnalysisPipeline(dummyLogger, repoPath);
    const result = await pipeline.run();
    const graph = result.graph;

    const components = graph.getAllComponents();
    const repositories = components.filter((c) => c.type === "REPOSITORY").length;
    assert.strictEqual(repositories, 3, "Expected 3 repositories in PetClinic");

    const violations = engine.analyze(graph);
    const bypassCount = violations.filter((v) => v.type === "BYPASS_SERVICE").length;
    const circularCount = violations.filter((v) => v.type === "CIRCULAR_DEPENDENCY").length;
    const unusedCount = violations.filter((v) => v.type === "UNUSED_SERVICE").length;

    assert.strictEqual(bypassCount, 5, "Expected exactly 5 layer violations in PetClinic");
    assert.strictEqual(circularCount, 0, "Expected 0 circular dependencies in PetClinic");
    assert.strictEqual(unusedCount, 0, "Expected 0 unused services in PetClinic");

    const scoreInfo = engine.calculateHealthScore(violations);
    assert.strictEqual(scoreInfo.score, 50, "Expected health score of 50/100 for PetClinic");
  });

  it("should validate PiggyMetrics if present", async function () {
    const repoPath = path.resolve(__dirname, "../../examples/piggymetrics");
    if (!fs.existsSync(repoPath)) {
      console.log(`[INFO] PiggyMetrics not found at ${repoPath}. Skipping E2E test.`);
      this.skip();
      return;
    }

    const pipeline = new AnalysisPipeline(dummyLogger, repoPath);
    const result = await pipeline.run();
    const graph = result.graph;

    const components = graph.getAllComponents();
    const repositories = components.filter((c) => c.type === "REPOSITORY").length;
    assert.strictEqual(repositories, 4, "Expected 4 repositories in PiggyMetrics");

    const violations = engine.analyze(graph);
    const bypassCount = violations.filter((v) => v.type === "BYPASS_SERVICE").length;
    const circularCount = violations.filter((v) => v.type === "CIRCULAR_DEPENDENCY").length;
    const unusedCount = violations.filter((v) => v.type === "UNUSED_SERVICE").length;

    assert.strictEqual(bypassCount, 0, "Expected 0 layer violations in PiggyMetrics");
    assert.strictEqual(circularCount, 0, "Expected 0 circular dependencies in PiggyMetrics");
    assert.strictEqual(unusedCount, 0, "Expected 0 unused services in PiggyMetrics");

    const scoreInfo = engine.calculateHealthScore(violations);
    assert.strictEqual(scoreInfo.score, 100, "Expected health score of 100/100 for PiggyMetrics");
  });

  it("should validate Shopizer if present", async function () {
    const repoPath = path.resolve(__dirname, "../../examples/shopizer");
    if (!fs.existsSync(repoPath)) {
      console.log(`[INFO] Shopizer not found at ${repoPath}. Skipping E2E test.`);
      this.skip();
      return;
    }

    const pipeline = new AnalysisPipeline(dummyLogger, repoPath);
    const result = await pipeline.run();
    const graph = result.graph;

    const components = graph.getAllComponents();
    const repositories = components.filter((c) => c.type === "REPOSITORY").length;
    assert.strictEqual(repositories, 72, "Expected 72 repositories in Shopizer");

    const violations = engine.analyze(graph);
    const bypassCount = violations.filter((v) => v.type === "BYPASS_SERVICE").length;
    const circularCount = violations.filter((v) => v.type === "CIRCULAR_DEPENDENCY").length;
    const unusedCount = violations.filter((v) => v.type === "UNUSED_SERVICE").length;

    assert.strictEqual(bypassCount, 0, "Expected 0 layer violations in Shopizer");
    assert.strictEqual(circularCount, 1, "Expected exactly 1 circular dependency in Shopizer");
    assert.strictEqual(unusedCount, 2, "Expected exactly 2 unused services in Shopizer");

    const scoreInfo = engine.calculateHealthScore(violations);
    assert.strictEqual(scoreInfo.score, 75, "Expected health score of 75/100 for Shopizer");
  });
});
