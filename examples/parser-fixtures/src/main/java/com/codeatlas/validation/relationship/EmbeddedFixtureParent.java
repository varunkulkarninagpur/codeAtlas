package com.codeatlas.validation.relationship;

// EXPECT: COMPONENT: ENTITY
// EXPECT: DEPENDS ON: EmbeddedFixtureChild
// EXPECT: RELATIONSHIP: EmbeddedFixtureChild: ORM_RELATIONSHIP
// EXPECT: VIOLATION: none

import javax.persistence.Entity;
import javax.persistence.Embedded;

@Entity
public class EmbeddedFixtureParent {
    @Embedded
    private EmbeddedFixtureChild child;
}
