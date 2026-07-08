import { RelationshipType } from "../../common/types";
/**
 * Detects circular dependencies in the architecture graph.
 * Only DEPENDENCY and INHERITANCE edges are considered — ORM bidirectional
 * relationships are intentional object-model mappings and must never be flagged
 * as circular architectural coupling.
 */
export class CircularDependencyRule {
    analyze(graph) {
        const cycles = graph.findCycles(CircularDependencyRule.CYCLE_EDGE_TYPES);
        const violations = [];
        const seenCycles = new Set();
        for (const cycle of cycles) {
            if (cycle.length < 2)
                continue;
            // Normalize cycle to filter duplicates (e.g., A->B->C, B->C->A, C->A->B)
            const normalized = this.normalizeCycle(cycle);
            const cycleKey = normalized.join(",");
            if (seenCycles.has(cycleKey)) {
                continue;
            }
            seenCycles.add(cycleKey);
            // Create readable path with simple class names
            const readablePath = cycle.map((nodeId) => {
                const comp = graph.getComponent(nodeId);
                return comp ? comp.className : nodeId;
            });
            // Append the first element to complete the circular path visualization
            readablePath.push(readablePath[0]);
            const message = `Circular dependency detected:\n${readablePath.join("\n→ ")}`;
            const firstComp = graph.getComponent(cycle[0]);
            const location = firstComp
                ? {
                    filePath: firstComp.filePath,
                    line: 1,
                    column: 1,
                }
                : undefined;
            violations.push({
                id: `CIRCULAR_DEPENDENCY_${cycleKey.replace(/[^a-zA-Z0-9]/g, "_")}`,
                type: "CIRCULAR_DEPENDENCY",
                severity: "ERROR",
                message,
                affectedNodes: cycle,
                location,
                sourceFilePath: firstComp?.filePath,
                sourceLineNumber: 1,
            });
        }
        return violations;
    }
    /**
     * Normalizes a cycle by shifting it so the lexicographically smallest element is at index 0.
     * This ensures that different representations of the same loop are recognized as identical.
     */
    normalizeCycle(cycle) {
        if (cycle.length === 0)
            return [];
        let minIdx = 0;
        for (let i = 1; i < cycle.length; i++) {
            if (cycle[i] < cycle[minIdx]) {
                minIdx = i;
            }
        }
        return [...cycle.slice(minIdx), ...cycle.slice(0, minIdx)];
    }
}
CircularDependencyRule.CYCLE_EDGE_TYPES = {
    types: [RelationshipType.DEPENDENCY, RelationshipType.INHERITANCE],
};
