package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.service.AuthService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }
}