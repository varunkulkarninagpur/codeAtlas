package com.codeatlas.validation.client;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

// EXPECT: Component: none
// EXPECT: Depends On: none
// EXPECT: Violation: none
@Retention(RetentionPolicy.RUNTIME)
public @interface MyCustomAnnotation {
}
