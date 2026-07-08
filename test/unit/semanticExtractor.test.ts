import * as assert from "assert";
import { JavaParser } from "../../src/parser/JavaParser";
import { SemanticExtractor } from "../../src/parser/SemanticExtractor";

describe("SemanticExtractor Tests", () => {
  let parser: JavaParser;
  let extractor: SemanticExtractor;

  beforeEach(() => {
    parser = new JavaParser();
    extractor = new SemanticExtractor();
  });

  it("should extract package name, imports, class name, and annotation type", () => {
    const javaSource = `
      package com.example.demo;
      import org.springframework.web.bind.annotation.RestController;
      import com.example.demo.service.UserService;

      @RestController
      public class UserController {
      }
    `;

    const ast = parser.parse(javaSource);
    const metadata = extractor.extract(ast, "/path/to/UserController.java");

    assert.strictEqual(metadata.packageName, "com.example.demo");
    assert.strictEqual(metadata.className, "UserController");
    assert.strictEqual(metadata.fullyQualifiedName, "com.example.demo.UserController");
    assert.strictEqual(metadata.type, "CONTROLLER");
    assert.deepStrictEqual(metadata.imports, [
      "org.springframework.web.bind.annotation.RestController",
      "com.example.demo.service.UserService",
    ]);
  });

  it("should extract dependencies from field declarations and constructor parameters", () => {
    const javaSource = `
      package com.example.demo;
      import org.springframework.stereotype.Service;

      @Service
      public class UserService {
          private final UserRepository userRepository;
          private EmailService emailService;

          public UserService(UserRepository userRepository, OtherService otherService) {
              this.userRepository = userRepository;
          }
      }
    `;

    const ast = parser.parse(javaSource);
    const metadata = extractor.extract(ast, "/path/to/UserService.java");

    assert.strictEqual(metadata.className, "UserService");
    assert.strictEqual(metadata.type, "SERVICE");
    const depNames = metadata.dependencies.map((d) => d.className);
    assert.ok(depNames.includes("UserRepository"));
    assert.ok(depNames.includes("EmailService"));
    assert.ok(depNames.includes("OtherService"));
    // Duplicates should be filtered out
    assert.strictEqual(
      depNames.filter((x) => x === "UserRepository").length,
      1,
    );
  });

  it("should filter out standard Java types and self-class reference dependencies", () => {
    const javaSource = `
      package com.example.demo;
      import org.springframework.stereotype.Service;
      import java.util.List;

      @Service
      public class UserService {
          private String name;
          private List<String> roles;
          private UserService selfReference;
      }
    `;

    const ast = parser.parse(javaSource);
    const metadata = extractor.extract(ast, "/path/to/UserService.java");

    assert.strictEqual(metadata.dependencies.length, 0);
  });

  it("should default type to CLASS when no Spring annotations are present", () => {
    const javaSource = `
      package com.example.demo;
      public class User {
      }
    `;

    const ast = parser.parse(javaSource);
    const metadata = extractor.extract(ast, "/path/to/User.java");

    assert.strictEqual(metadata.type, "CLASS");
  });

  it("should extract record name and properties correctly", () => {
    const javaSource = `
      package com.example.demo;
      public record UserRecord(Long id, String name) {
      }
    `;

    const ast = parser.parse(javaSource);
    const metadata = extractor.extract(ast, "/path/to/UserRecord.java");

    assert.strictEqual(metadata.className, "UserRecord");
    assert.strictEqual(metadata.type, "CLASS");
  });

  it("should extract enum name and properties correctly", () => {
    const javaSource = `
      package com.example.demo;
      public enum UserRole {
          ADMIN, USER
      }
    `;

    const ast = parser.parse(javaSource);
    const metadata = extractor.extract(ast, "/path/to/UserRole.java");

    assert.strictEqual(metadata.className, "UserRole");
    assert.strictEqual(metadata.type, "CLASS");
  });

  it("should extract mapped superclass and embeddable annotations as entities", () => {
    const javaSource = `
      package com.example.demo;
      import javax.persistence.MappedSuperclass;
      import javax.persistence.Embeddable;

      @MappedSuperclass
      public class BaseEntity {}
    `;

    const ast = parser.parse(javaSource);
    const metadata = extractor.extract(ast, "/path/to/BaseEntity.java");

    assert.strictEqual(metadata.type, "ENTITY");
    assert.strictEqual(metadata.className, "BaseEntity");
  });

  it("should extract controller advice and rest controller advice annotations as controllers", () => {
    const javaSource = `
      package com.example.demo;
      import org.springframework.web.bind.annotation.ControllerAdvice;

      @ControllerAdvice
      public class GlobalExceptionHandler {}
    `;

    const ast = parser.parse(javaSource);
    const metadata = extractor.extract(ast, "/path/to/GlobalExceptionHandler.java");

    assert.strictEqual(metadata.type, "CONTROLLER");
    assert.strictEqual(metadata.className, "GlobalExceptionHandler");
  });
});
