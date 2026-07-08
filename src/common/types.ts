// Shared type definitions for CodeAtlas static analyzer

export type ComponentType = "CONTROLLER" | "SERVICE" | "REPOSITORY" | "ENTITY" | "CLASS";

/**
 * Semantic type of a relationship between two components in the architecture graph.
 * Using an enum ensures type safety and enables exhaustive switch statements.
 */
export enum RelationshipType {
  /** Direct code dependency: constructor injection, field injection, method parameter */
  DEPENDENCY = "DEPENDENCY",
  /** Type hierarchy: extends / implements */
  INHERITANCE = "INHERITANCE",
  /** JPA/Hibernate persistence mapping: @OneToMany, @ManyToOne, @ManyToMany, @OneToOne, @Embedded, @EmbeddedId, @IdClass */
  ORM_RELATIONSHIP = "ORM_RELATIONSHIP",
  /** Reserved: Spring event publication and consumption */
  EVENT = "EVENT",
  /** Reserved: Spring configuration wiring (@Bean, @Import, @PropertySource) */
  CONFIGURATION = "CONFIGURATION",
}

/**
 * Abstraction for filtering graph queries by relationship type.
 * Designed to be extensible: add new filter fields here without changing graph API signatures.
 */
export interface EdgeQuery {
  /** If specified, only edges whose type is in this list are returned. */
  types?: RelationshipType[];
}

export interface SourceLocation {
  filePath: string;
  line: number;
  column: number;
}

export interface DependencyReference {
  className: string;
  /** Semantic type of this relationship, determined at extraction time. */
  relationshipType: RelationshipType;
  location: SourceLocation;
}

export interface JavaClass {
  filePath: string;
  packageName: string;
  className: string;
  fullyQualifiedName: string;
  type: ComponentType;
  baseTypes: string[]; // List of explicitly extended or implemented type simple names
  dependencies: DependencyReference[]; // List of class types injected/used
  imports: string[];
}

export interface GraphNode {
  id: string; // Fully qualified class name
  label: string; // Simple class name
  metadata: JavaClass;
}

export interface GraphEdgeMetadata {
  /** Arbitrary extension bag — add fields here without changing the graph model. */
  [key: string]: unknown;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: RelationshipType;
  /** Optional metadata for future semantic enrichment (e.g. annotation name, cardinality). */
  metadata?: GraphEdgeMetadata;
}

export interface ArchitectureViolation {
  id: string;
  type: "BYPASS_SERVICE" | "CIRCULAR_DEPENDENCY" | "UNUSED_SERVICE";
  message: string;
  severity: "WARNING" | "ERROR";
  affectedNodes: string[];
  location?: SourceLocation;
  sourceFilePath?: string;
  sourceLineNumber?: number;
}

export interface HealthScore {
  score: number;
  explanations: string[];
}
