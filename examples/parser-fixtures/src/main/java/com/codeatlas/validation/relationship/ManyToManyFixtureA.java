package com.codeatlas.validation.relationship;

// EXPECT: COMPONENT: ENTITY
// EXPECT: DEPENDS ON: ManyToManyFixtureB
// EXPECT: RELATIONSHIP: ManyToManyFixtureB: ORM_RELATIONSHIP
// EXPECT: VIOLATION: none

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import java.util.Set;

@Entity
public class ManyToManyFixtureA {
    @ManyToMany
    private Set<ManyToManyFixtureB> relatedB;
}
