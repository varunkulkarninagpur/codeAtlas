package com.codeatlas.validation.entity;

import javax.persistence.Embeddable;

// EXPECT: Component: ENTITY
// EXPECT: Stereotype: @Embeddable
// EXPECT: Type: class
// EXPECT: Extends: none
// EXPECT: Implements: none
// EXPECT: Depends On: none
// EXPECT: Violation: none
@Embeddable
public class EmbeddableAddress {
    private String street;
}
