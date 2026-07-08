package com.codeatlas.demo.controller;

import com.codeatlas.demo.repository.CartRepository;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CartController {
    private CartRepository cartRepository;

    public CartController(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }
}
