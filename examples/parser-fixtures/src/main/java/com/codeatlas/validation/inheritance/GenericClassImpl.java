package com.codeatlas.validation.inheritance;

// EXPECT: Component: none
// EXPECT: Stereotype: none
// EXPECT: Type: class
// EXPECT: Extends: none
// EXPECT: Implements: GenericInterface
// EXPECT: Depends On: none
// EXPECT: Violation: none
public class GenericClassImpl<T extends Level1Base> implements GenericInterface<T> {
    private T value;
    public T get() { return value; }
}
