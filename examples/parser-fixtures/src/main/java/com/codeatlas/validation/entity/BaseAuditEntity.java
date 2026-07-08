package com.codeatlas.validation.entity;

import javax.persistence.MappedSuperclass;

// EXPECT: Component: ENTITY
// EXPECT: Stereotype: @MappedSuperclass
// EXPECT: Type: class
// EXPECT: Extends: none
// EXPECT: Implements: none
// EXPECT: Depends On: none
// EXPECT: Violation: none
@MappedSuperclass
public abstract class BaseAuditEntity {
}
