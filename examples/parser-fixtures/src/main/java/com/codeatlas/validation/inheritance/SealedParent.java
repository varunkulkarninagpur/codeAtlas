package com.codeatlas.validation.inheritance;

// EXPECT: Component: none
// EXPECT: Stereotype: none
// EXPECT: Type: sealed-class
// EXPECT: Extends: none
// EXPECT: Implements: none
// EXPECT: Depends On: none
// EXPECT: Violation: CIRCULAR_DEPENDENCY
public sealed class SealedParent permits NonSealedChild {
}
