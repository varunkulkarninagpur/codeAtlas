package com.codeatlas.enterprise.service;
import com.codeatlas.enterprise.repository.MaintenanceRecordRepository;
import org.springframework.stereotype.Service;
@Service
public class MaintenanceService {
    private final MaintenanceRecordRepository maintenanceRecordRepository;
    private final SchedulingService schedulingService;
    public MaintenanceService(MaintenanceRecordRepository maintenanceRecordRepository, SchedulingService schedulingService) {
        this.maintenanceRecordRepository = maintenanceRecordRepository;
        this.schedulingService = schedulingService;
    }
}