package com.codeatlas.demo.service;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    private final OrderService orderService;

    public NotificationService(OrderService orderService) {
        this.orderService = orderService;
    }
}
