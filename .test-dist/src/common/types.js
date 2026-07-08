// Shared type definitions for CodeAtlas static analyzer
/**
 * Semantic type of a relationship between two components in the architecture graph.
 * Using an enum ensures type safety and enables exhaustive switch statements.
 */
export var RelationshipType;
(function (RelationshipType) {
    /** Direct code dependency: constructor injection, field injection, method parameter */
    RelationshipType["DEPENDENCY"] = "DEPENDENCY";
    /** Type hierarchy: extends / implements */
    RelationshipType["INHERITANCE"] = "INHERITANCE";
    /** JPA/Hibernate persistence mapping: @OneToMany, @ManyToOne, @ManyToMany, @OneToOne, @Embedded, @EmbeddedId, @IdClass */
    RelationshipType["ORM_RELATIONSHIP"] = "ORM_RELATIONSHIP";
    /** Reserved: Spring event publication and consumption */
    RelationshipType["EVENT"] = "EVENT";
    /** Reserved: Spring configuration wiring (@Bean, @Import, @PropertySource) */
    RelationshipType["CONFIGURATION"] = "CONFIGURATION";
})(RelationshipType || (RelationshipType = {}));
