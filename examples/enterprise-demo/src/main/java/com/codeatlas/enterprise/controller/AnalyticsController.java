package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.service.AnalyticsService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class AnalyticsController {
    private final AnalyticsService analyticsService;
    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }
}