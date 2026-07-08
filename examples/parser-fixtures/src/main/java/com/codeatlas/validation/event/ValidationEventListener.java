package com.codeatlas.validation.event;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

// EXPECT: Component: none
// EXPECT: Depends On: ValidationEvent
// EXPECT: Violation: none
@Component
public class ValidationEventListener {

    @EventListener
    public void handleEvent(ValidationEvent event) {
    }
}
