package com.codeatlas.validation.exception;

// EXPECT: Component: none
// EXPECT: Depends On: none
// EXPECT: Violation: none
public class ValidationException extends RuntimeException {
    public ValidationException(String msg) {
        super(msg);
    }
}
