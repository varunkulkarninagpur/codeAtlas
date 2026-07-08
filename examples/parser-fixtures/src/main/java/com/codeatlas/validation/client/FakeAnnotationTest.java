package com.codeatlas.validation.client;

import org.springframework.beans.factory.annotation.Autowired;

// EXPECT: Component: none
// EXPECT: Depends On: none
// EXPECT: Violation: none
@ServiceLike
@RepositoryLike
public class FakeAnnotationTest {

    // @Autowired
    // private String commentedAutowired;

    @Autowired
    private String realAutowired;
}

@interface ServiceLike {}
@interface RepositoryLike {}
