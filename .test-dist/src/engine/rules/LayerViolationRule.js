import { RelationshipType } from "../../common/types";
/**
 * Detects when a Controller directly injects a Repository via a DEPENDENCY edge,
 * bypassing the Service layer. ORM relationships are explicitly excluded: a Controller
 * referencing an Entity type via @OneToMany would not be flagged.
 */
export class LayerViolationRule {
    analyze(graph) {
        const violations = [];
        const components = graph.getAllComponents();
        for (const component of components) {
            if (component.type === "CONTROLLER") {
                // Only inspect genuine code-level dependencies, not ORM or inheritance
                const outgoing = graph.getOutgoing(component.fullyQualifiedName, LayerViolationRule.DEPENDENCY_ONLY);
                for (const targetId of outgoing) {
                    const target = graph.getComponent(targetId);
                    if (target && target.type === "REPOSITORY") {
                        const depRef = graph.getConnectionReference(component.fullyQualifiedName, target.fullyQualifiedName);
                        violations.push({
                            id: `BYPASS_SERVICE_${component.fullyQualifiedName}_${target.fullyQualifiedName}`,
                            type: "BYPASS_SERVICE",
                            message: `Controller '${component.className}' directly depends on Repository '${target.className}'. Introduce a Service layer.`,
                            severity: "ERROR",
                            affectedNodes: [component.fullyQualifiedName, target.fullyQualifiedName],
                            location: depRef?.location,
                            sourceFilePath: component.filePath,
                            sourceLineNumber: depRef?.location?.line,
                        });
                    }
                }
            }
        }
        return violations;
    }
}
LayerViolationRule.DEPENDENCY_ONLY = { types: [RelationshipType.DEPENDENCY] };
