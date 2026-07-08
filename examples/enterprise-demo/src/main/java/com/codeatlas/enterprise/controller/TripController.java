package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.service.TripService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class TripController {
    private final TripService tripService;
    public TripController(TripService tripService) {
        this.tripService = tripService;
    }
}