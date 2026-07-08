package com.codeatlas.validation.relationship;

// EXPECT: COMPONENT: none
// EXPECT: DEPENDS ON: MixedDependencyTarget, MixedOrmTarget
// EXPECT: RELATIONSHIP: MixedDependencyTarget: DEPENDENCY
// EXPECT: RELATIONSHIP: MixedOrmTarget: ORM_RELATIONSHIP
// EXPECT: VIOLATION: none

import javax.persistence.OneToOne;

public class MixedRelationshipFixture {
    private final MixedDependencyTarget depTarget;

    @OneToOne
    private MixedOrmTarget ormTarget;

    public MixedRelationshipFixture(MixedDependencyTarget depTarget) {
        this.depTarget = depTarget;
    }
}
