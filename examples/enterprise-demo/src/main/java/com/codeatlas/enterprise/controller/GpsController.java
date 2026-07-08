package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.service.GpsTrackingService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class GpsController {
    private final GpsTrackingService gpsTrackingService;
    public GpsController(GpsTrackingService gpsTrackingService) {
        this.gpsTrackingService = gpsTrackingService;
    }
}