// Constants for CodeAtlas static analyzer

export const IGNORED_JAVA_TYPES = new Set([
  "String",
  "Integer",
  "Long",
  "Boolean",
  "Double",
  "Float",
  "Character",
  "Byte",
  "Short",
  "Object",
  "List",
  "Set",
  "Map",
  "Optional",
  "Collection",
  "ArrayList",
  "HashSet",
  "HashMap",
]);

/**
 * JPA/Hibernate field-level annotations that indicate an ORM persistence relationship.
 * Fields annotated with any of these produce ORM_RELATIONSHIP edges, not DEPENDENCY edges.
 */
export const ORM_FIELD_ANNOTATIONS = new Set([
  "OneToMany",
  "ManyToOne",
  "ManyToMany",
  "OneToOne",
  "Embedded",
  "EmbeddedId",
  "IdClass",
]);

