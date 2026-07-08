import { ArchitectureGraph } from "../ArchitectureGraph";
import { ArchitectureViolation } from "../../common/types";

/**
 * Interface defining a contract for architectural analysis rules.
 */
export interface IArchitectureRule {
  /**
   * Analyzes the given graph and returns a list of architectural violations.
   * @param graph The ArchitectureGraph instance.
   */
  analyze(graph: ArchitectureGraph): ArchitectureViolation[];
}
