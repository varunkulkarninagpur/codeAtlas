package com.codeatlas.enterprise.service;
import com.codeatlas.enterprise.repository.GeofenceRepository;
import org.springframework.stereotype.Service;
@Service
public class GeofenceService {
    private final GeofenceRepository geofenceRepository;
    private final NotificationService notificationService;
    public GeofenceService(GeofenceRepository geofenceRepository, NotificationService notificationService) {
        this.geofenceRepository = geofenceRepository;
        this.notificationService = notificationService;
    }
}