package com.codeatlas.validation.relationship;

// EXPECT: COMPONENT: ENTITY
// EXPECT: DEPENDS ON: none
// EXPECT: VIOLATION: none

import javax.persistence.Embeddable;

@Embeddable
public class EmbeddedFixtureChild {
    private String name;
}
