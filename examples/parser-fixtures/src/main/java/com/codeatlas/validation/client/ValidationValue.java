package com.codeatlas.validation.client;

import lombok.Value;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

// EXPECT: Component: none
// EXPECT: Depends On: none
// EXPECT: Violation: none
@Value
@AllArgsConstructor
public class ValidationValue {
    private final String key;
    private final String value;
}
