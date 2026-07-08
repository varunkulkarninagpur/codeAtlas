package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.service.DriverService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class DriverController {
    private final DriverService driverService;
    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }
}