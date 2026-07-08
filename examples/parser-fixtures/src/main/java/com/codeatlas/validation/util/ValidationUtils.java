package com.codeatlas.validation.util;

// EXPECT: Component: none
// EXPECT: Depends On: none
// EXPECT: Violation: none
public final class ValidationUtils {
    public static final String CONSTANT = "VALIDATION";
    private ValidationUtils() {}
    public static boolean isValid(String str) {
        return str != null && !str.isEmpty();
    }
}
