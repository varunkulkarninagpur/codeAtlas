package com.codeatlas.demo.controller;

import com.codeatlas.demo.repository.UserRepository;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BadController {
    // Field injection (legacy style) to test field dependency extraction
    private UserRepository userRepository;

    public BadController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
