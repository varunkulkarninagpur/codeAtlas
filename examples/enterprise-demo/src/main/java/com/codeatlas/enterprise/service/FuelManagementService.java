package com.codeatlas.enterprise.service;
import com.codeatlas.enterprise.repository.FuelLogRepository;
import org.springframework.stereotype.Service;
@Service
public class FuelManagementService {
    private final FuelLogRepository fuelLogRepository;
    public FuelManagementService(FuelLogRepository fuelLogRepository) {
        this.fuelLogRepository = fuelLogRepository;
    }
}