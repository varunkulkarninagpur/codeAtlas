package com.codeatlas.validation.relationship;

// EXPECT: COMPONENT: ENTITY
// EXPECT: DEPENDS ON: ManyToManyFixtureA
// EXPECT: RELATIONSHIP: ManyToManyFixtureA: ORM_RELATIONSHIP
// EXPECT: VIOLATION: none

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import java.util.Set;

@Entity
public class ManyToManyFixtureB {
    @ManyToMany(mappedBy = "relatedB")
    private Set<ManyToManyFixtureA> relatedA;
}
