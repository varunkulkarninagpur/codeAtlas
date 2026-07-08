package com.codeatlas.validation.event;

import org.springframework.context.ApplicationEvent;

// EXPECT: Component: none
// EXPECT: Stereotype: none
// EXPECT: Type: class
// EXPECT: Extends: ApplicationEvent
// EXPECT: Implements: none
// EXPECT: Depends On: none
// EXPECT: Violation: none
public class ValidationEvent extends ApplicationEvent {
    public ValidationEvent(Object source) {
        super(source);
    }
}
