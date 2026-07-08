package com.codeatlas.enterprise.service;
import org.springframework.stereotype.Service;
@Service
public class AnalyticsService {
    private final ReportingService reportingService;
    public AnalyticsService(ReportingService reportingService) {
        this.reportingService = reportingService;
    }
}