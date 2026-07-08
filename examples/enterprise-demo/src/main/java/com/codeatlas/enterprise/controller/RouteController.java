package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.service.RouteService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class RouteController {
    private final RouteService routeService;
    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }
}