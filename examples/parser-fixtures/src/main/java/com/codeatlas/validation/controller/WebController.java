package com.codeatlas.validation.controller;

import org.springframework.stereotype.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import com.codeatlas.validation.inheritance.BaseComponent;
import java.util.List;

// EXPECT: Component: CONTROLLER
// EXPECT: Stereotype: @Controller
// EXPECT: Type: class
// EXPECT: Extends: none
// EXPECT: Implements: none
// EXPECT: Depends On: BaseComponent
// EXPECT: Violation: none
@Controller
public class WebController {

    private List<BaseComponent> components;

    @Autowired
    public void setComponents(List<BaseComponent> components) {
        this.components = components;
    }
}
