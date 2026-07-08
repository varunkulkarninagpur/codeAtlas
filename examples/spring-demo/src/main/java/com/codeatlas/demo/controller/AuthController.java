package com.codeatlas.demo.controller;

import com.codeatlas.demo.service.AuthService;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }
}
