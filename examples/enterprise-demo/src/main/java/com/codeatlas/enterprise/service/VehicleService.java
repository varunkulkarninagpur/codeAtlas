package com.codeatlas.enterprise.service;
import com.codeatlas.enterprise.repository.VehicleRepository;
import org.springframework.stereotype.Service;
@Service
public class VehicleService {
    private final VehicleRepository vehicleRepository;
    private final AuditLoggingService auditLoggingService;
    private final ValidationService validationService;
    public VehicleService(VehicleRepository vehicleRepository, AuditLoggingService auditLoggingService, ValidationService validationService) {
        this.vehicleRepository = vehicleRepository;
        this.auditLoggingService = auditLoggingService;
        this.validationService = validationService;
    }
}