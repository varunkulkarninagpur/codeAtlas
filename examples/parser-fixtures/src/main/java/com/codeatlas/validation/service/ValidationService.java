package com.codeatlas.validation.service;

import com.codeatlas.validation.inheritance.BaseComponent;

// EXPECT: Component: none
// EXPECT: Stereotype: none
// EXPECT: Type: interface
// EXPECT: Extends: BaseComponent
// EXPECT: Implements: none
// EXPECT: Depends On: none
// EXPECT: Violation: CIRCULAR_DEPENDENCY
public interface ValidationService extends BaseComponent {
}
