package com.codeatlas.enterprise.service;
import com.codeatlas.enterprise.repository.DriverRepository;
import org.springframework.stereotype.Service;
@Service
public class DriverService {
    private final DriverRepository driverRepository;
    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }
}