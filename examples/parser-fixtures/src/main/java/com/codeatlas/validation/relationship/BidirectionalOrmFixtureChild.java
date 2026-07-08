package com.codeatlas.validation.relationship;

// EXPECT: COMPONENT: ENTITY
// EXPECT: DEPENDS ON: BidirectionalOrmFixtureParent
// EXPECT: RELATIONSHIP: BidirectionalOrmFixtureParent: ORM_RELATIONSHIP
// EXPECT: VIOLATION: none

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
public class BidirectionalOrmFixtureChild {
    @ManyToOne
    private BidirectionalOrmFixtureParent parent;
}
