package com.codeatlas.validation.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import com.codeatlas.validation.repository.MyCrudRepository;

// EXPECT: Component: CONTROLLER
// EXPECT: Stereotype: @RestController
// EXPECT: Type: class
// EXPECT: Extends: none
// EXPECT: Implements: none
// EXPECT: Depends On: MyCrudRepository
// EXPECT: Violation: BYPASS_SERVICE
@RestController
public class BypassController {

    @Autowired
    private MyCrudRepository myCrudRepository;
}
