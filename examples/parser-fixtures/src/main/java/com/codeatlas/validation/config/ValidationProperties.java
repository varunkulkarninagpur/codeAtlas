package com.codeatlas.validation.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

// EXPECT: Component: none
// EXPECT: Depends On: none
// EXPECT: Violation: none
@ConfigurationProperties(prefix = "validation")
public class ValidationProperties {
    private String pattern;
    public String getPattern() { return pattern; }
    public void setPattern(String pattern) { this.pattern = pattern; }
}
