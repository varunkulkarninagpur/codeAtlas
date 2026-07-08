package com.codeatlas.validation.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

// EXPECT: Component: SERVICE
// EXPECT: Stereotype: @Service
// EXPECT: Type: class
// EXPECT: Extends: none
// EXPECT: Implements: none
// EXPECT: Depends On: CircularServiceA
// EXPECT: Violation: CIRCULAR_DEPENDENCY
@Service
public class CircularServiceB {

    @Autowired
    private CircularServiceA circularServiceA;
}
