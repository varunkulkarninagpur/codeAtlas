package com.codeatlas.validation.dto;

import javax.validation.constraints.NotNull;

// EXPECT: Component: none
// EXPECT: Depends On: none
// EXPECT: Violation: none
public record ValidationRequest(@NotNull String payload) {
}
