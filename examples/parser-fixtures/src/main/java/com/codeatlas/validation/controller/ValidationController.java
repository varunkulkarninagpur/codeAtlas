package com.codeatlas.validation.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import com.codeatlas.validation.service.ValidationService;

// EXPECT: Component: CONTROLLER
// EXPECT: Stereotype: @RestController
// EXPECT: Type: class
// EXPECT: Extends: none
// EXPECT: Implements: none
// EXPECT: Depends On: ValidationService
// EXPECT: Violation: none
@RestController
public class ValidationController {

    private final ValidationService validationService;

    @Autowired
    public ValidationController(ValidationService validationService) {
        this.validationService = validationService;
    }
}
