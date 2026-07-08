package com.codeatlas.demo.service;

import org.springframework.stereotype.Service;

@Service
public class LegacyDiscountService {
    public Double getDiscount(Long userId) {
        return 0.15;
    }
}
