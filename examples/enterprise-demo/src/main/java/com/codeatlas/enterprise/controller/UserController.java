package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.service.UserService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class UserController {
    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }
}