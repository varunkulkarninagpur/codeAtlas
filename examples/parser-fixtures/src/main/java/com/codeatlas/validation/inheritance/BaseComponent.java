package com.codeatlas.validation.inheritance;

// EXPECT: Component: none
// EXPECT: Stereotype: none
// EXPECT: Type: sealed-interface
// EXPECT: Extends: none
// EXPECT: Implements: none
// EXPECT: Depends On: none
// EXPECT: Violation: CIRCULAR_DEPENDENCY
public sealed interface BaseComponent permits Level5Concrete, com.codeatlas.validation.service.ValidationService {
}
