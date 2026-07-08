package com.codeatlas.validation.relationship;

// EXPECT: COMPONENT: ENTITY
// EXPECT: DEPENDS ON: BidirectionalOrmFixtureChild
// EXPECT: RELATIONSHIP: BidirectionalOrmFixtureChild: ORM_RELATIONSHIP
// EXPECT: VIOLATION: none

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.Set;

@Entity
public class BidirectionalOrmFixtureParent {
    @OneToMany(mappedBy = "parent")
    private Set<BidirectionalOrmFixtureChild> children;
}
