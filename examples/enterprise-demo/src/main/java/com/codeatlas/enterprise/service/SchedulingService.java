package com.codeatlas.enterprise.service;
import com.codeatlas.enterprise.repository.ScheduleItemRepository;
import org.springframework.stereotype.Service;
@Service
public class SchedulingService {
    private final ScheduleItemRepository scheduleItemRepository;
    private final MaintenanceService maintenanceService;
    public SchedulingService(ScheduleItemRepository scheduleItemRepository, MaintenanceService maintenanceService) {
        this.scheduleItemRepository = scheduleItemRepository;
        this.maintenanceService = maintenanceService;
    }
}