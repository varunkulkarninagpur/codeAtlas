import * as assert from "assert";
import * as fs from "fs/promises";
import * as path from "path";
import { JavaParser } from "../../src/parser/JavaParser";
import { SemanticExtractor } from "../../src/parser/SemanticExtractor";
import { ArchitectureGraph } from "../../src/engine/ArchitectureGraph";
import { ComponentTypeResolver } from "../../src/engine/ComponentTypeResolver";
import { ArchitectureEngine } from "../../src/engine/ArchitectureEngine";
import { LayerViolationRule } from "../../src/engine/rules/LayerViolationRule";
import { CircularDependencyRule } from "../../src/engine/rules/CircularDependencyRule";
import { UnusedServiceRule } from "../../src/engine/rules/UnusedServiceRule";
import { JavaClass } from "../../src/common/types";

describe("E2E Integration Verification with spring-demo", () => {
  const demoPath = path.join(__dirname, "..", "..", "examples", "spring-demo");

  // Helper to recursively find files matching a suffix
  async function findFiles(dir: string, suffix: string): Promise<string[]> {
    let results: string[] = [];
    const list = await fs.readdir(dir, { withFileTypes: true });
    for (const file of list) {
      const res = path.resolve(dir, file.name);
      if (file.isDirectory()) {
        results = results.concat(await findFiles(res, suffix));
      } else if (file.isFile() && file.name.endsWith(suffix)) {
        results.push(res);
      }
    }
    return results;
  }

  // Name resolver identical to our pipeline
  function resolveDependencyFqName(
    sourceClass: JavaClass,
    depSimpleName: string,
    allClassList: JavaClass[],
  ): string | null {
    const explicitImport = sourceClass.imports.find((imp) => imp.endsWith(`.${depSimpleName}`));
    if (explicitImport) {
      return explicitImport;
    }
    const samePackageFqName = sourceClass.packageName
      ? `${sourceClass.packageName}.${depSimpleName}`
      : depSimpleName;
    const existsInSamePackage = allClassList.some((c) => c.fullyQualifiedName === samePackageFqName);
    if (existsInSamePackage) {
      return samePackageFqName;
    }
    const matchingClass = allClassList.find((c) => c.className === depSimpleName);
    if (matchingClass) {
      return matchingClass.fullyQualifiedName;
    }
    return null;
  }

  it("should process spring-demo classes and flag exactly one direct controller-to-repository bypass violation", async () => {
    // 1. Scan
    const filePaths = await findFiles(demoPath, ".java");
    assert.strictEqual(filePaths.length, 31, "Expected 31 java files in spring-demo fixture");

    // 2. Parse & Extract
    const parser = new JavaParser();
    const extractor = new SemanticExtractor();
    const graph = new ArchitectureGraph();
    const classes: JavaClass[] = [];

    for (const filePath of filePaths) {
      const sourceCode = await fs.readFile(filePath, "utf8");
      const ast = parser.parse(sourceCode);
      const javaClass = extractor.extract(ast, filePath);
      classes.push(javaClass);
      graph.addComponent(javaClass);
    }

    const resolver = new ComponentTypeResolver();
    resolver.resolve(classes);

    // 3. Connect Graph
    for (const javaClass of classes) {
      for (const depRef of javaClass.dependencies) {
        const resolvedFqName = resolveDependencyFqName(javaClass, depRef.className, classes);
        if (resolvedFqName) {
          graph.connect(javaClass.fullyQualifiedName, resolvedFqName, depRef.relationshipType);
        }
      }
    }

    // 4. Analyze Engine
    const engine = new ArchitectureEngine([new LayerViolationRule()]);
    const violations = engine.analyze(graph);

    // Verify Output details
    assert.strictEqual(violations.length, 2, "Expected exactly 2 violations in spring-demo");
    const violation = violations.find(v => v.affectedNodes.includes("com.codeatlas.demo.controller.BadController"));
    assert.ok(violation, "Expected violation for BadController");
    assert.strictEqual(violation!.type, "BYPASS_SERVICE");
    assert.ok(
      violation!.message.includes("Controller 'BadController' directly depends on Repository 'UserRepository'"),
    );
    assert.ok(
      violation!.affectedNodes.includes("com.codeatlas.demo.controller.BadController"),
    );
    assert.ok(
      violation!.affectedNodes.includes("com.codeatlas.demo.repository.UserRepository"),
    );
  });

  it("should process enterprise-demo classes and flag exactly 2 bypass, 2 circular, and 3 unused service violations", async () => {
    const entPath = path.join(__dirname, "..", "..", "examples", "enterprise-demo");
    const filePaths = await findFiles(entPath, ".java");
    assert.strictEqual(filePaths.length, 70, "Expected 70 java files in enterprise-demo fixture");

    const parser = new JavaParser();
    const extractor = new SemanticExtractor();
    const graph = new ArchitectureGraph();
    const classes: JavaClass[] = [];

    for (const filePath of filePaths) {
      const sourceCode = await fs.readFile(filePath, "utf8");
      const ast = parser.parse(sourceCode);
      const javaClass = extractor.extract(ast, filePath);
      classes.push(javaClass);
      graph.addComponent(javaClass);
    }

    const resolver = new ComponentTypeResolver();
    resolver.resolve(classes);

    for (const javaClass of classes) {
      for (const depRef of javaClass.dependencies) {
        const resolvedFqName = resolveDependencyFqName(javaClass, depRef.className, classes);
        if (resolvedFqName) {
          graph.connect(javaClass.fullyQualifiedName, resolvedFqName, depRef.relationshipType);
        }
      }
    }

    const engine = new ArchitectureEngine([
      new LayerViolationRule(),
      new CircularDependencyRule(),
      new UnusedServiceRule(),
    ]);

    const violations = engine.analyze(graph);

    // Verify exactly 2 bypass service, 2 circular dependency, 3 unused service violations (Total 7)
    assert.strictEqual(violations.length, 7, "Expected exactly 7 violations in enterprise-demo");

    const bypassCount = violations.filter(v => v.type === "BYPASS_SERVICE").length;
    const circularCount = violations.filter(v => v.type === "CIRCULAR_DEPENDENCY").length;
    const unusedCount = violations.filter(v => v.type === "UNUSED_SERVICE").length;

    assert.strictEqual(bypassCount, 2, "Expected exactly 2 Layer Violations");
    assert.strictEqual(circularCount, 2, "Expected exactly 2 Circular Dependencies");
    assert.strictEqual(unusedCount, 3, "Expected exactly 3 Unused Services");
  });

  it("should pass all parser validation conformance suite assertions", async () => {
    const { runValidationSuite } = require("../../scripts/validate-parser");
    const result = await runValidationSuite();
    assert.strictEqual(result.failed, false, `Validation Failed:\n${result.failures.join("\n")}`);
  });
});
