# CodeAtlas Supported Java & Spring Features

This document tracks the language constructs, framework annotations, and database mappings supported by CodeAtlas v1.0 static analyzer.

---

## 1. Java Language Support

CodeAtlas parses and processes the following core Java language structures:

| Feature | Support | Description |
| :--- | :--- | :--- |
| **Class** | Yes | Normal concrete classes. |
| **Abstract Class** | Yes | Abstract base classes. |
| **Final Class** | Yes | Non-extensible classes. |
| **Interface** | Yes | Standard interfaces. |
| **Sealed Interface** | Yes | Constrained interface hierarchies. |
| **Sealed Class** | Yes | Constrained class hierarchies. |
| **Non-Sealed Class** | Yes | Classes extending sealed parents. |
| **Record** | Yes | Java records (DTO mappings). |
| **Enum** | Yes | Enumeration types. |
| **Annotation Type** | Yes | Custom developer annotation type declarations. |
| **Nested Types** | Yes | Inner and static nested classes. |
| **Generic Class/Interface** | Yes | Parametric types (e.g., `MyService<T>`). |
| **Deep Inheritance** | Yes | Resolves type structures down multiple levels of inheritance. |
| **Lambdas & Expressions** | Yes | Ignored from semantic component analysis (no structural impact). |

---

## 2. Spring Boot Component Model

CodeAtlas detects, registers, and resolves references for standard Spring components:

*   **Controllers**: `@RestController`, `@Controller`, `@ControllerAdvice`, `@RestControllerAdvice`.
*   **Services**: `@Service` annotated components.
*   **Repositories**: `@Repository` annotated components, plus interfaces inheriting from:
    *   `CrudRepository`
    *   `PagingAndSortingRepository`
    *   `JpaRepository`
    *   `Repository` (base marker)
*   **Configuration**: `@Configuration`, `@Bean`, `@ConfigurationProperties`, `@ComponentScan`.
*   **Scheduling & Events**: `@Scheduled`, `@EventListener`.
*   **Dependency Injection**: Constructor parameters, `@Autowired` field/setter injection, `@Qualifier`, and `@Lazy` resolutions.

---

## 3. JPA / Hibernate ORM Model

Dependencies mapped through database entity mappings are classified as `ORM_RELATIONSHIP` type and excluded from architectural layer or circular violations:

*   **Annotations**: `@Entity`, `@MappedSuperclass`, `@Embeddable`.
*   **Cardinality**: `@OneToOne`, `@OneToMany`, `@ManyToOne`, `@ManyToMany`.
*   **Identities**: `@Embedded`, `@EmbeddedId`, `@IdClass`.

---

## 4. Lombok Integration

Lombok's boilerplate-free code generation is supported implicitly during parsing:
*   `@Builder`, `@Data`, `@Value`, `@RequiredArgsConstructor`, `@Getter`, `@Setter`.

---

## 5. Architectural Rule Coverage

CodeAtlas v1.0 validates codebases against three architectural rules:

1.  **Layer Violation (`BYPASS_SERVICE`)**: Verifies that Controllers do not directly inject or depend on Repository interfaces. They must go through a Service.
2.  **Circular Dependency (`CIRCULAR_DEPENDENCY`)**: Detects architectural reference cycles between components (restricted to `DEPENDENCY` and `INHERITANCE` edges).
3.  **Unused Service (`UNUSED_SERVICE`)**: Flags services that are never injected or referenced by any other component in the workspace.
