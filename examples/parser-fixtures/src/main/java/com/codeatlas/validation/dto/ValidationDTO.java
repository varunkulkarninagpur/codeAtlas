package com.codeatlas.validation.dto;

import lombok.Data;
import lombok.Builder;
import lombok.ToString;
import lombok.EqualsAndHashCode;

// EXPECT: Component: none
// EXPECT: Depends On: none
// EXPECT: Violation: none
@Data
@Builder
@ToString
@EqualsAndHashCode
public class ValidationDTO {
    private String id;
    private String name;
}
