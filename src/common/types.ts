// Shared type definitions for CodeAtlas static analyzer

export type ComponentType = "CONTROLLER" | "SERVICE" | "REPOSITORY" | "ENTITY" | "UNKNOWN";

export interface JavaClassMetadata {
  filePath: string;
  packageName: string;
  className: string;
  type: ComponentType;
  injectedDependencies: string[]; // List of class types injected (e.g. constructor or autowired)
  imports: string[];
}

export interface GraphNode {
  id: string; // Fully qualified class name
  label: string; // Simple class name
  metadata: JavaClassMetadata;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: "INJECTION" | "USAGE";
}

export interface ArchitectureViolation {
  id: string;
  type: "BYPASS_SERVICE" | "CIRCULAR_DEPENDENCY" | "UNUSED_SERVICE";
  message: string;
  severity: "WARNING" | "ERROR";
  affectedNodes: string[];
  sourceFilePath?: string;
  sourceLineNumber?: number;
}

export interface HealthScore {
  score: number;
  explanations: string[];
}
