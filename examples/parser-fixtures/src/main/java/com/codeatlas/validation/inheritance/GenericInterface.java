package com.codeatlas.validation.inheritance;

// EXPECT: Component: none
// EXPECT: Stereotype: none
// EXPECT: Type: interface
// EXPECT: Extends: none
// EXPECT: Implements: none
// EXPECT: Depends On: none
// EXPECT: Violation: none
public interface GenericInterface<T> {
    T get();
}
