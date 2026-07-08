package com.codeatlas.validation.dto;

// EXPECT: Component: none
// EXPECT: Depends On: none
// EXPECT: Violation: none
public record ValidationResponse(String status, String message) {
}
