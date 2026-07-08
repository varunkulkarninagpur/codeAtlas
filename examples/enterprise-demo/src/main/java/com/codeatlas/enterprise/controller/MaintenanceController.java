package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.service.MaintenanceService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class MaintenanceController {
    private final MaintenanceService maintenanceService;
    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }
}