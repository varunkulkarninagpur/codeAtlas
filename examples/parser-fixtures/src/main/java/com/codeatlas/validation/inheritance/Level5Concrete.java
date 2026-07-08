package com.codeatlas.validation.inheritance;

import javax.persistence.Entity;

// EXPECT: Component: ENTITY
// EXPECT: Stereotype: @Entity
// EXPECT: Type: class
// EXPECT: Extends: Level4Validation
// EXPECT: Implements: BaseComponent
// EXPECT: Depends On: none
// EXPECT: Violation: CIRCULAR_DEPENDENCY
@Entity
public final class Level5Concrete extends Level4Validation implements BaseComponent {
}
