import { IArchitectureRule } from "./IArchitectureRule";
import { ArchitectureGraph } from "../ArchitectureGraph";
import { ArchitectureViolation, RelationshipType } from "../../common/types";

/**
 * Detects services that are not referenced by any other component via a DEPENDENCY edge.
 * ORM and inheritance relationships are excluded: a service referenced only via an ORM
 * mapping (unusual but possible) would still be flagged as unused.
 */
export class UnusedServiceRule implements IArchitectureRule {
  private static readonly DEPENDENCY_ONLY = { types: [RelationshipType.DEPENDENCY] };
  private static readonly DEPENDENCY_AND_INHERITANCE = {
    types: [RelationshipType.DEPENDENCY, RelationshipType.INHERITANCE],
  };

  public analyze(graph: ArchitectureGraph): ArchitectureViolation[] {
    const violations: ArchitectureViolation[] = [];
    const components = graph.getAllComponents();

    for (const comp of components) {
      if (comp.type === "SERVICE") {
        const incoming = graph.getIncoming(comp.fullyQualifiedName, UnusedServiceRule.DEPENDENCY_ONLY).filter(
          (sourceId) => sourceId !== comp.fullyQualifiedName,
        );
        let isUsed = incoming.length > 0;

        if (!isUsed) {
          const outgoing = graph.getOutgoing(comp.fullyQualifiedName, UnusedServiceRule.DEPENDENCY_AND_INHERITANCE);
          for (const outId of outgoing) {
            const targetComp = graph.getComponent(outId);
            if (targetComp) {
              const targetIncoming = graph.getIncoming(outId, UnusedServiceRule.DEPENDENCY_ONLY).filter(
                (srcId) => srcId !== comp.fullyQualifiedName && srcId !== outId,
              );
              if (targetIncoming.length > 0) {
                isUsed = true;
                break;
              }
            }
          }
        }

        if (!isUsed) {
          violations.push({
            id: `UNUSED_SERVICE_${comp.fullyQualifiedName.replace(/[^a-zA-Z0-9]/g, "_")}`,
            type: "UNUSED_SERVICE",
            message: `Service '${comp.className}' is not referenced by any other component.`,
            severity: "WARNING",
            affectedNodes: [comp.fullyQualifiedName],
            location: {
              filePath: comp.filePath,
              line: 1,
              column: 1,
            },
            sourceFilePath: comp.filePath,
            sourceLineNumber: 1,
          });
        }
      }
    }

    return violations;
  }
}
