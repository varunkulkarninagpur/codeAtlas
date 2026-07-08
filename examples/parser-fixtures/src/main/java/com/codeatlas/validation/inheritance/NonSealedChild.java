package com.codeatlas.validation.inheritance;

// EXPECT: Component: none
// EXPECT: Stereotype: none
// EXPECT: Type: class
// EXPECT: Extends: SealedParent
// EXPECT: Implements: none
// EXPECT: Depends On: none
// EXPECT: Violation: CIRCULAR_DEPENDENCY
public non-sealed class NonSealedChild extends SealedParent {
}
