package com.codeatlas.enterprise.service;
import org.springframework.stereotype.Service;
@Service
public class NotificationService {
    private final GpsTrackingService gpsTrackingService;
    private final SmsNotificationService smsNotificationService;
    private final EmailNotificationService emailNotificationService;
    public NotificationService(GpsTrackingService gpsTrackingService, SmsNotificationService smsNotificationService, EmailNotificationService emailNotificationService) {
        this.gpsTrackingService = gpsTrackingService;
        this.smsNotificationService = smsNotificationService;
        this.emailNotificationService = emailNotificationService;
    }
}