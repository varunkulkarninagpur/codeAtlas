package com.codeatlas.validation.relationship;

// EXPECT: COMPONENT: none
// EXPECT: DEPENDS ON: ConstructorDependencyTarget
// EXPECT: RELATIONSHIP: ConstructorDependencyTarget: DEPENDENCY
// EXPECT: VIOLATION: none

public class ConstructorInjectionFixture {
    private final ConstructorDependencyTarget target;

    public ConstructorInjectionFixture(ConstructorDependencyTarget target) {
        this.target = target;
    }
}
