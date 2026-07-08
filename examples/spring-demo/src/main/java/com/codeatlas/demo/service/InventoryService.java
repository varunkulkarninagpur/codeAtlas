package com.codeatlas.demo.service;

import org.springframework.stereotype.Service;

@Service
public class InventoryService {
    private final NotificationService notificationService;

    public InventoryService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
}
