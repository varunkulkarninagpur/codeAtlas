package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.service.VehicleService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class VehicleController {
    private final VehicleService vehicleService;
    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }
}