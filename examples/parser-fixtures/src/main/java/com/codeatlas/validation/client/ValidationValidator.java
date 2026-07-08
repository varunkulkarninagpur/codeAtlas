package com.codeatlas.validation.client;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

// EXPECT: Component: none
// EXPECT: Depends On: none
// EXPECT: Violation: none
public class ValidationValidator implements ConstraintValidator<MyCustomAnnotation, String> {
    
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value != null;
    }
}
