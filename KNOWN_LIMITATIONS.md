# CodeAtlas Known Limitations

CodeAtlas v1.0.0 is designed as a lightweight, local-first static analysis tool. Because it operates entirely within the VS Code Extension Host using static source code parsing, certain design trade-offs and functional boundaries are established. 

Below is an honest assessment of CodeAtlas's current scope and intentional limitations.

---

## 1. Static Analysis Boundaries (No Runtime Information)

CodeAtlas analyzes source code ASTs statically without compiling, running, or loading the codebase into a JVM. 

### Limitations:
*   **No Runtime Reflection**: Structural references created dynamically via reflection (`Class.forName()`, `Method.invoke()`) are invisible to CodeAtlas.
*   **No Dynamic Bean Resolution**: If beans are registered dynamically (e.g., via `BeanDefinitionRegistryPostProcessor` or programmatic bean registration), they will not appear as components.
*   **No Conditional Beans**: Configuration annotations like `@ConditionalOnProperty`, `@ConditionalOnClass`, or `@Profile` are parsed, but the conditions are not evaluated. CodeAtlas assumes all components defined in source files are active.
*   **Bytecode Ignored**: Compiled `.class` files and external packaged libraries (`.jar` files) are not scanned. CodeAtlas only analyzes source code within the workspace.

---

## 2. Framework & Language Scope

### Limitations:
*   **Java Only (v1)**: Only Java source code (`.java` files) is parsed. There is currently no support for Kotlin, Scala, or other JVM languages.
*   **Spring Boot/JPA Spec Focus**: Component classification is based on standard Spring Boot conventions (`@Service`, `@Repository`, etc.) and JPA specifications (`@Entity`, `@ManyToMany`, etc.). Non-standard custom frameworks or alternative dependency injection systems are not supported.

---

## 3. Dependency & Module Boundaries

### Limitations:
*   **No Build Tool Dependency Graphs**: CodeAtlas does not read Maven `pom.xml` or Gradle `build.gradle` dependency trees. It does not trace external third-party library dependencies (e.g., it will not map your code's dependency on Spring's internal classes).
*   **Single Combined Workspace Graph**: In multi-module Maven/Gradle reactor builds, CodeAtlas scans all modules under the active VS Code workspace folder and merges them into a single graph. Specific module boundary rule validation (e.g. "Module A cannot import Module B") is not supported.
*   **Source-Only Interface Lineage**: The `ComponentTypeResolver` recursively walks the inheritance tree of interfaces to infer types (e.g., detecting indirect repositories). However, if an interface extends a class/interface defined only in an external packaged library, CodeAtlas cannot trace the lineage beyond the local source files.
