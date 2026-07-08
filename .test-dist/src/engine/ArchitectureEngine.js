/**
 * ArchitectureEngine acts as the container orchestrating multiple analysis rules.
 * It executes them sequentially against the ArchitectureGraph to collect and merge violations.
 */
export class ArchitectureEngine {
    constructor(rules) {
        this.rules = rules;
    }
    /**
     * Analyzes the graph against all registered rules.
     * @param graph The ArchitectureGraph representation.
     * @returns List of all merged architectural violations.
     */
    analyze(graph) {
        const allViolations = [];
        for (const rule of this.rules) {
            const violations = rule.analyze(graph);
            allViolations.push(...violations);
        }
        return allViolations;
    }
    calculateHealthScore(violations) {
        let score = 100;
        const explanations = ["Base Score: 100"];
        let bypassCount = 0;
        let circularCount = 0;
        let unusedCount = 0;
        for (const v of violations) {
            if (v.type === "BYPASS_SERVICE") {
                score -= 10;
                bypassCount++;
            }
            else if (v.type === "CIRCULAR_DEPENDENCY") {
                score -= 15;
                circularCount++;
            }
            else if (v.type === "UNUSED_SERVICE") {
                score -= 5;
                unusedCount++;
            }
        }
        if (bypassCount > 0) {
            explanations.push(`Layer Violations: -${bypassCount * 10} (${bypassCount} issues)`);
        }
        if (circularCount > 0) {
            explanations.push(`Circular Dependencies: -${circularCount * 15} (${circularCount} issues)`);
        }
        if (unusedCount > 0) {
            explanations.push(`Unused Services: -${unusedCount * 5} (${unusedCount} issues)`);
        }
        score = Math.max(0, Math.min(100, score));
        return {
            score,
            explanations,
        };
    }
}
