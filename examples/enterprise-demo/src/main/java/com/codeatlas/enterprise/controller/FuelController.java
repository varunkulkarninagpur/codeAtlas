package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.repository.FuelLogRepository;
import com.codeatlas.enterprise.service.FuelManagementService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class FuelController {
    private final FuelLogRepository fuelLogRepository;
    private final FuelManagementService fuelManagementService;
    public FuelController(FuelLogRepository fuelLogRepository, FuelManagementService fuelManagementService) {
        this.fuelLogRepository = fuelLogRepository;
        this.fuelManagementService = fuelManagementService;
    }
}