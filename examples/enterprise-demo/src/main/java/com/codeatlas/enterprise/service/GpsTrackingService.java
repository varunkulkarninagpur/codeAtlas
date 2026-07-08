package com.codeatlas.enterprise.service;
import com.codeatlas.enterprise.repository.GpsCoordinateRepository;
import org.springframework.stereotype.Service;
@Service
public class GpsTrackingService {
    private final GpsCoordinateRepository gpsCoordinateRepository;
    private final GeofenceService geofenceService;
    public GpsTrackingService(GpsCoordinateRepository gpsCoordinateRepository, GeofenceService geofenceService) {
        this.gpsCoordinateRepository = gpsCoordinateRepository;
        this.geofenceService = geofenceService;
    }
}