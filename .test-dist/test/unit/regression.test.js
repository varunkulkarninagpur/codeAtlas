import * as assert from "assert";
import { JavaParser } from "../../src/parser/JavaParser";
import { SemanticExtractor } from "../../src/parser/SemanticExtractor";
import { ArchitectureGraph } from "../../src/engine/ArchitectureGraph";
import { ArchitectureEngine } from "../../src/engine/ArchitectureEngine";
import { LayerViolationRule } from "../../src/engine/rules/LayerViolationRule";
import { CircularDependencyRule } from "../../src/engine/rules/CircularDependencyRule";
import { UnusedServiceRule } from "../../src/engine/rules/UnusedServiceRule";
describe("Regression Validation Suite", () => {
    let parser;
    let extractor;
    beforeEach(() => {
        parser = new JavaParser();
        extractor = new SemanticExtractor();
    });
    // Name resolver helper for connection mapping
    function resolveDependencyFqName(sourceClass, depSimpleName, allClassList) {
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
    it("should validate all Spring Boot annotation combinations, components, record/enum types, and injection patterns", () => {
        const fixtures = [
            // 1. Controller Advice component
            {
                path: "/path/to/GlobalExceptionHandler.java",
                source: `
          package com.example.demo.exception;
          import org.springframework.web.bind.annotation.ControllerAdvice;
          @ControllerAdvice
          public class GlobalExceptionHandler {}
        `,
            },
            // 2. Configuration & Bean component definitions
            {
                path: "/path/to/AppConfig.java",
                source: `
          package com.example.demo.config;
          import org.springframework.context.annotation.Configuration;
          import org.springframework.context.annotation.Bean;
          import com.example.demo.service.PaymentService;
          @Configuration
          public class AppConfig {
              @Bean
              public PaymentService paymentService() { return null; }
          }
        `,
            },
            // 3. Entity, MappedSuperclass, Embeddable database schemas
            {
                path: "/path/to/BaseEntity.java",
                source: `
          package com.example.demo.entity;
          import javax.persistence.MappedSuperclass;
          @MappedSuperclass
          public abstract class BaseEntity {}
        `,
            },
            {
                path: "/path/to/AuditInfo.java",
                source: `
          package com.example.demo.entity;
          import javax.persistence.Embeddable;
          @Embeddable
          public class AuditInfo {}
        `,
            },
            // 4. Java Record pattern
            {
                path: "/path/to/ProductRecord.java",
                source: `
          package com.example.demo.dto;
          public record ProductRecord(Long id, String name) {}
        `,
            },
            // 5. Java Enum pattern
            {
                path: "/path/to/OrderStatus.java",
                source: `
          package com.example.demo.dto;
          public enum OrderStatus { PENDING, SHIPPED }
        `,
            },
            // 6. Injection patterns (@Autowired, @Qualifier, @Lazy, lombok modifiers)
            {
                path: "/path/to/OrderService.java",
                source: `
          package com.example.demo.service;
          import org.springframework.stereotype.Service;
          import org.springframework.beans.factory.annotation.Autowired;
          import org.springframework.beans.factory.annotation.Qualifier;
          import org.springframework.context.annotation.Lazy;
          import lombok.RequiredArgsConstructor;
          import com.example.demo.repository.OrderRepository;

          @Service
          @RequiredArgsConstructor
          public class OrderService {
              @Autowired
              @Qualifier("primary")
              @Lazy
              private OrderRepository orderRepository;
          }
        `,
            },
            // 7. Repository interface
            {
                path: "/path/to/OrderRepository.java",
                source: `
          package com.example.demo.repository;
          import org.springframework.stereotype.Repository;
          @Repository
          public interface OrderRepository {}
        `,
            },
        ];
        const graph = new ArchitectureGraph();
        const classes = [];
        // Parse and Extract all fixtures
        for (const f of fixtures) {
            const ast = parser.parse(f.source);
            const javaClass = extractor.extract(ast, f.path);
            classes.push(javaClass);
            graph.addComponent(javaClass);
        }
        // Connect Graph
        for (const javaClass of classes) {
            for (const depRef of javaClass.dependencies) {
                const resolved = resolveDependencyFqName(javaClass, depRef.className, classes);
                if (resolved) {
                    graph.connect(javaClass.fullyQualifiedName, resolved);
                }
            }
        }
        // Assert counts
        assert.strictEqual(classes.length, 8);
        const names = classes.map(c => c.className);
        assert.ok(names.includes("GlobalExceptionHandler"));
        assert.ok(names.includes("AppConfig"));
        assert.ok(names.includes("BaseEntity"));
        assert.ok(names.includes("AuditInfo"));
        assert.ok(names.includes("ProductRecord"));
        assert.ok(names.includes("OrderStatus"));
        assert.ok(names.includes("OrderService"));
        assert.ok(names.includes("OrderRepository"));
        // Check component types
        const exceptionHandler = classes.find(c => c.className === "GlobalExceptionHandler");
        assert.strictEqual(exceptionHandler.type, "CONTROLLER");
        const baseEntity = classes.find(c => c.className === "BaseEntity");
        assert.strictEqual(baseEntity.type, "ENTITY");
        const auditInfo = classes.find(c => c.className === "AuditInfo");
        assert.strictEqual(auditInfo.type, "ENTITY");
        // Check relationship resolution (OrderService depends on OrderRepository via Autowired field)
        const orderService = classes.find(c => c.className === "OrderService");
        assert.strictEqual(orderService.dependencies.length, 1);
        assert.strictEqual(orderService.dependencies[0].className, "OrderRepository");
        const outgoing = graph.getOutgoing(orderService.fullyQualifiedName);
        assert.strictEqual(outgoing.length, 1);
        assert.strictEqual(outgoing[0], "com.example.demo.repository.OrderRepository");
    });
    it("should validate all rules in a simulated enterprise workspace context", () => {
        const graph = new ArchitectureGraph();
        const classes = [];
        const workspace = [
            // Direct Repository access (Layer Violation)
            {
                path: "/path/to/DirectController.java",
                source: `
          package com.example.demo.controller;
          import org.springframework.web.bind.annotation.RestController;
          import com.example.demo.repository.ProductRepository;
          @RestController
          public class DirectController {
              private ProductRepository productRepository;
          }
        `,
            },
            // Repository
            {
                path: "/path/to/ProductRepository.java",
                source: `
          package com.example.demo.repository;
          import org.springframework.stereotype.Repository;
          @Repository
          public interface ProductRepository {}
        `,
            },
            // Circular dependency services
            {
                path: "/path/to/ServiceA.java",
                source: `
          package com.example.demo.service;
          import org.springframework.stereotype.Service;
          @Service
          public class ServiceA {
              private ServiceB serviceB;
          }
        `,
            },
            {
                path: "/path/to/ServiceB.java",
                source: `
          package com.example.demo.service;
          import org.springframework.stereotype.Service;
          @Service
          public class ServiceB {
              private ServiceA serviceA;
          }
        `,
            },
            // Unused service
            {
                path: "/path/to/UnusedService.java",
                source: `
          package com.example.demo.service;
          import org.springframework.stereotype.Service;
          @Service
          public class UnusedService {}
        `,
            },
        ];
        for (const w of workspace) {
            const ast = parser.parse(w.source);
            const javaClass = extractor.extract(ast, w.path);
            classes.push(javaClass);
            graph.addComponent(javaClass);
        }
        for (const javaClass of classes) {
            for (const depRef of javaClass.dependencies) {
                const resolved = resolveDependencyFqName(javaClass, depRef.className, classes);
                if (resolved) {
                    graph.connect(javaClass.fullyQualifiedName, resolved, depRef.relationshipType);
                }
            }
        }
        const engine = new ArchitectureEngine([
            new LayerViolationRule(),
            new CircularDependencyRule(),
            new UnusedServiceRule(),
        ]);
        const violations = engine.analyze(graph);
        // Should flag 3 violations:
        // 1. Layer violation (DirectController -> ProductRepository)
        // 2. Circular dependency (ServiceA <-> ServiceB)
        // 3. Unused service (UnusedService)
        assert.strictEqual(violations.length, 3);
        const types = violations.map(v => v.type);
        assert.ok(types.includes("BYPASS_SERVICE"));
        assert.ok(types.includes("CIRCULAR_DEPENDENCY"));
        assert.ok(types.includes("UNUSED_SERVICE"));
    });
});
