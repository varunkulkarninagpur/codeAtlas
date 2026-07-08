import * as fs from "fs";
import * as path from "path";
import { JavaParser } from "../src/parser/JavaParser";
import { SemanticExtractor } from "../src/parser/SemanticExtractor";
import { ArchitectureGraph } from "../src/engine/ArchitectureGraph";
import { ComponentTypeResolver } from "../src/engine/ComponentTypeResolver";
import { ArchitectureEngine } from "../src/engine/ArchitectureEngine";
import { LayerViolationRule } from "../src/engine/rules/LayerViolationRule";
import { CircularDependencyRule } from "../src/engine/rules/CircularDependencyRule";
import { UnusedServiceRule } from "../src/engine/rules/UnusedServiceRule";
import { JavaClass } from "../src/common/types";

// Recursively find all files matching a suffix
function findFiles(dir: string, suffix: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of list) {
    const res = path.resolve(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(findFiles(res, suffix));
    } else if (file.isFile() && file.name.endsWith(suffix)) {
      results.push(res);
    }
  }
  return results;
}

function resolveDependencyFqName(
  sourceClass: JavaClass,
  depSimpleName: string,
  allClassList: JavaClass[],
): string | null {
  const explicitImport = sourceClass.imports.find((imp: string) => imp.endsWith(`.${depSimpleName}`));
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

export async function validateRepo(repoPath: string, repoName: string) {
  const filePaths = findFiles(repoPath, ".java");
  console.log(`Found ${filePaths.length} Java files in ${repoPath}`);

  const parser = new JavaParser();
  const extractor = new SemanticExtractor();
  const graph = new ArchitectureGraph();
  const classes: JavaClass[] = [];
  const parserFailures: { file: string; error: string }[] = [];
  let relationshipsDiscovered = 0;

  for (const filePath of filePaths) {
    const content = fs.readFileSync(filePath, "utf8");
    try {
      const ast = parser.parse(content);
      const javaClass = extractor.extract(ast, filePath);
      // Skip empty metadata (usually interfaces with no methods or empty files)
      if (javaClass.className || javaClass.packageName) {
         classes.push(javaClass);
         graph.addComponent(javaClass);
      }
    } catch (e: any) {
      parserFailures.push({ file: filePath, error: e.message });
    }
  }

  console.log(`Successfully extracted ${classes.length} components.`);

  const resolver = new ComponentTypeResolver();
  resolver.resolve(classes);

  for (const javaClass of classes) {
    for (const depRef of javaClass.dependencies) {
      const resolvedFqName = resolveDependencyFqName(javaClass, depRef.className, classes);
      if (resolvedFqName) {
        // Prevent duplicate edges
        if (!graph.getOutgoing(javaClass.fullyQualifiedName).includes(resolvedFqName)) {
           graph.connect(javaClass.fullyQualifiedName, resolvedFqName, depRef.relationshipType);
           relationshipsDiscovered++;
        }
      }
    }
  }
  
  const engine = new ArchitectureEngine([
    new LayerViolationRule(),
    new CircularDependencyRule(),
    new UnusedServiceRule(),
  ]);
  const violations = engine.analyze(graph);
  
  const controllers = classes.filter(c => c.type === "CONTROLLER").length;
  const services = classes.filter(c => c.type === "SERVICE").length;
  const repositories = classes.filter(c => c.type === "REPOSITORY").length;
  const entities = classes.filter(c => c.type === "ENTITY").length;

  const layerViolations = violations.filter(v => v.type === "BYPASS_SERVICE").length;
  const circularDeps = violations.filter(v => v.type === "CIRCULAR_DEPENDENCY").length;
  const unusedServices = violations.filter(v => v.type === "UNUSED_SERVICE").length;

  const score = engine.calculateHealthScore(violations);

  const reportPath = path.resolve(__dirname, `../docs/validation/${repoName}.md`);
  
  // Ensure directory exists
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });

  const reportContent = `=====================================
CodeAtlas Validation Report: ${repoName}
=====================================
Total Java Files: ${filePaths.length}
Components Discovered: ${classes.length}
- Controllers: ${controllers}
- Services: ${services}
- Repositories: ${repositories}
- Entities: ${entities}
Relationships Discovered: ${relationshipsDiscovered}

Rule Violations: ${violations.length}
- Layer Violations: ${layerViolations}
- Circular Dependencies: ${circularDeps}
- Unused Services: ${unusedServices}

Architecture Health: ${score.score}/100

Parser Failures: ${parserFailures.length}

### Parser Failures
${parserFailures.length === 0 ? "None" : parserFailures.map(f => `- **${path.basename(f.file)}**: ${f.error}`).join("\n")}

### Unsupported Constructs Encountered
${parserFailures.length > 0 ? "- Parsing complex or unsupported syntax (see failures above)" : "None explicitly caught during this run."}

### Rule Violations Sample (Top 50)
${violations.slice(0, 50).map((v: any) => `- **${v.type}**: ${v.message} (Nodes: ${v.affectedNodes.join(', ')})`).join("\n")}
`;

  fs.writeFileSync(reportPath, reportContent);
  console.log(`Report written to ${reportPath}`);
  
  // Also dump a JSON string to console to easily capture baseline metrics
  console.log(JSON.stringify({
    javaFiles: filePaths.length,
    components: classes.length,
    controllers,
    services,
    repositories,
    entities,
    relationships: relationshipsDiscovered,
    layerViolations,
    circularDeps,
    unusedServices,
    health: score.score
  }));
}

const targetRepo = process.argv[2];
const repoName = process.argv[3];
if (!targetRepo || !repoName) {
  console.error("Usage: npx ts-node scripts/validate-repo.ts <path-to-repo> <repo-name>");
  process.exit(1);
}

validateRepo(path.resolve(process.cwd(), targetRepo), repoName).catch(e => {
  console.error(e);
  process.exit(1);
});
