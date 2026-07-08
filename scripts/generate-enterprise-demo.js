const fs = require("fs");
const path = require("path");

const baseDir = path.resolve(__dirname, "../examples/enterprise-demo/src/main/java/com/codeatlas/enterprise");

const files = [
  // Entities
  {
    dir: "entity",
    name: "Vehicle",
    code: `package com.codeatlas.enterprise.entity;
import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
public class Vehicle {
    @Id
    private Long id;
    private String plateNumber;
    private String model;
}`
  },
  {
    dir: "entity",
    name: "Driver",
    code: `package com.codeatlas.enterprise.entity;
import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
public class Driver {
    @Id
    private Long id;
    private String name;
    private String licenseNumber;
}`
  },
  {
    dir: "entity",
    name: "Route",
    code: `package com.codeatlas.enterprise.entity;
import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
public class Route {
    @Id
    private Long id;
    private String startLocation;
    private String endLocation;
}`
  },
  {
    dir: "entity",
    name: "Trip",
    code: `package com.codeatlas.enterprise.entity;
import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
public class Trip {
    @Id
    private Long id;
    private Long vehicleId;
    private Long driverId;
    private Long routeId;
}`
  },
  {
    dir: "entity",
    name: "GpsCoordinate",
    code: `package com.codeatlas.enterprise.entity;
import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
public class GpsCoordinate {
    @Id
    private Long id;
    private Double latitude;
    private Double longitude;
}`
  },
  {
    dir: "entity",
    name: "Geofence",
    code: `package com.codeatlas.enterprise.entity;
import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
public class Geofence {
    @Id
    private Long id;
    private String name;
    private Double radius;
}`
  },
  {
    dir: "entity",
    name: "MaintenanceRecord",
    code: `package com.codeatlas.enterprise.entity;
import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
public class MaintenanceRecord {
    @Id
    private Long id;
    private Long vehicleId;
    private String description;
}`
  },
  {
    dir: "entity",
    name: "FuelLog",
    code: `package com.codeatlas.enterprise.entity;
import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
public class FuelLog {
    @Id
    private Long id;
    private Long vehicleId;
    private Double gallons;
}`
  },
  {
    dir: "entity",
    name: "ScheduleItem",
    code: `package com.codeatlas.enterprise.entity;
import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
public class ScheduleItem {
    @Id
    private Long id;
    private Long tripId;
}`
  },
  {
    dir: "entity",
    name: "Invoice",
    code: `package com.codeatlas.enterprise.entity;
import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
public class Invoice {
    @Id
    private Long id;
    private Double amount;
}`
  },
  {
    dir: "entity",
    name: "Payment",
    code: `package com.codeatlas.enterprise.entity;
import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
public class Payment {
    @Id
    private Long id;
    private Double amount;
}`
  },
  {
    dir: "entity",
    name: "AuditLog",
    code: `package com.codeatlas.enterprise.entity;
import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
public class AuditLog {
    @Id
    private Long id;
    private String action;
}`
  },

  // Repositories
  {
    dir: "repository",
    name: "VehicleRepository",
    code: `package com.codeatlas.enterprise.repository;
import com.codeatlas.enterprise.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {}`
  },
  {
    dir: "repository",
    name: "DriverRepository",
    code: `package com.codeatlas.enterprise.repository;
import com.codeatlas.enterprise.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {}`
  },
  {
    dir: "repository",
    name: "RouteRepository",
    code: `package com.codeatlas.enterprise.repository;
import com.codeatlas.enterprise.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {}`
  },
  {
    dir: "repository",
    name: "TripRepository",
    code: `package com.codeatlas.enterprise.repository;
import com.codeatlas.enterprise.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {}`
  },
  {
    dir: "repository",
    name: "GpsCoordinateRepository",
    code: `package com.codeatlas.enterprise.repository;
import com.codeatlas.enterprise.entity.GpsCoordinate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface GpsCoordinateRepository extends JpaRepository<GpsCoordinate, Long> {}`
  },
  {
    dir: "repository",
    name: "GeofenceRepository",
    code: `package com.codeatlas.enterprise.repository;
import com.codeatlas.enterprise.entity.Geofence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface GeofenceRepository extends JpaRepository<Geofence, Long> {}`
  },
  {
    dir: "repository",
    name: "MaintenanceRecordRepository",
    code: `package com.codeatlas.enterprise.repository;
import com.codeatlas.enterprise.entity.MaintenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, Long> {}`
  },
  {
    dir: "repository",
    name: "FuelLogRepository",
    code: `package com.codeatlas.enterprise.repository;
import com.codeatlas.enterprise.entity.FuelLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface FuelLogRepository extends JpaRepository<FuelLog, Long> {}`
  },
  {
    dir: "repository",
    name: "ScheduleItemRepository",
    code: `package com.codeatlas.enterprise.repository;
import com.codeatlas.enterprise.entity.ScheduleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ScheduleItemRepository extends JpaRepository<ScheduleItem, Long> {}`
  },
  {
    dir: "repository",
    name: "InvoiceRepository",
    code: `package com.codeatlas.enterprise.repository;
import com.codeatlas.enterprise.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {}`
  },
  {
    dir: "repository",
    name: "PaymentRepository",
    code: `package com.codeatlas.enterprise.repository;
import com.codeatlas.enterprise.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {}`
  },
  {
    dir: "repository",
    name: "AuditLogRepository",
    code: `package com.codeatlas.enterprise.repository;
import com.codeatlas.enterprise.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {}`
  },

  // Services
  {
    dir: "service",
    name: "VehicleService",
    code: `package com.codeatlas.enterprise.service;
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
}`
  },
  {
    dir: "service",
    name: "DriverService",
    code: `package com.codeatlas.enterprise.service;
import com.codeatlas.enterprise.repository.DriverRepository;
import org.springframework.stereotype.Service;
@Service
public class DriverService {
    private final DriverRepository driverRepository;
    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }
}`
  },
  {
    dir: "service",
    name: "RouteService",
    code: `package com.codeatlas.enterprise.service;
import com.codeatlas.enterprise.repository.RouteRepository;
import org.springframework.stereotype.Service;
@Service
public class RouteService {
    private final RouteRepository routeRepository;
    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }
}`
  },
  {
    dir: "service",
    name: "TripService",
    code: `package com.codeatlas.enterprise.service;
import com.codeatlas.enterprise.repository.TripRepository;
import org.springframework.stereotype.Service;
@Service
public class TripService {
    private final TripRepository tripRepository;
    public TripService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }
}`
  },
  {
    dir: "service",
    name: "GpsTrackingService",
    code: `package com.codeatlas.enterprise.service;
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
}`
  },
  {
    dir: "service",
    name: "GeofenceService",
    code: `package com.codeatlas.enterprise.service;
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
}`
  },
  {
    dir: "service",
    name: "NotificationService",
    code: `package com.codeatlas.enterprise.service;
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
}`
  },
  {
    dir: "service",
    name: "MaintenanceService",
    code: `package com.codeatlas.enterprise.service;
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
}`
  },
  {
    dir: "service",
    name: "SchedulingService",
    code: `package com.codeatlas.enterprise.service;
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
}`
  },
  {
    dir: "service",
    name: "FuelManagementService",
    code: `package com.codeatlas.enterprise.service;
import com.codeatlas.enterprise.repository.FuelLogRepository;
import org.springframework.stereotype.Service;
@Service
public class FuelManagementService {
    private final FuelLogRepository fuelLogRepository;
    public FuelManagementService(FuelLogRepository fuelLogRepository) {
        this.fuelLogRepository = fuelLogRepository;
    }
}`
  },
  {
    dir: "service",
    name: "InvoiceService",
    code: `package com.codeatlas.enterprise.service;
import com.codeatlas.enterprise.repository.InvoiceRepository;
import org.springframework.stereotype.Service;
@Service
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;
    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }
}`
  },
  {
    dir: "service",
    name: "PaymentService",
    code: `package com.codeatlas.enterprise.service;
public interface PaymentService {
    void process(Double amount);
}`
  },
  {
    dir: "service",
    name: "PaymentServiceImpl",
    code: `package com.codeatlas.enterprise.service;
import org.springframework.stereotype.Service;
@Service
public class PaymentServiceImpl implements PaymentService {
    @Override
    public void process(Double amount) {}
}`
  },
  {
    dir: "service",
    name: "AnalyticsService",
    code: `package com.codeatlas.enterprise.service;
import org.springframework.stereotype.Service;
@Service
public class AnalyticsService {
    private final ReportingService reportingService;
    public AnalyticsService(ReportingService reportingService) {
        this.reportingService = reportingService;
    }
}`
  },
  {
    dir: "service",
    name: "ReportingService",
    code: `package com.codeatlas.enterprise.service;
import org.springframework.stereotype.Service;
@Service
public class ReportingService {}`
  },
  {
    dir: "service",
    name: "AuditLoggingService",
    code: `package com.codeatlas.enterprise.service;
import com.codeatlas.enterprise.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
@Service
public class AuditLoggingService {
    private final AuditLogRepository auditLogRepository;
    public AuditLoggingService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
}`
  },
  {
    dir: "service",
    name: "AuthService",
    code: `package com.codeatlas.enterprise.service;
import org.springframework.stereotype.Service;
@Service
public class AuthService {}`
  },
  {
    dir: "service",
    name: "UserService",
    code: `package com.codeatlas.enterprise.service;
import org.springframework.stereotype.Service;
@Service
public class UserService {}`
  },
  {
    dir: "service",
    name: "ValidationService",
    code: `package com.codeatlas.enterprise.service;
import org.springframework.stereotype.Service;
@Service
public class ValidationService {}`
  },
  {
    dir: "service",
    name: "LegacyRouteOptimizer",
    code: `package com.codeatlas.enterprise.service;
import org.springframework.stereotype.Service;
@Service
public class LegacyRouteOptimizer {}`
  },
  {
    dir: "service",
    name: "LegacyVehicleValidator",
    code: `package com.codeatlas.enterprise.service;
import org.springframework.stereotype.Service;
@Service
public class LegacyVehicleValidator {}`
  },
  {
    dir: "service",
    name: "BackupNotificationService",
    code: `package com.codeatlas.enterprise.service;
import org.springframework.stereotype.Service;
@Service
public class BackupNotificationService {}`
  },
  {
    dir: "service",
    name: "SmsNotificationService",
    code: `package com.codeatlas.enterprise.service;
import org.springframework.stereotype.Service;
@Service
public class SmsNotificationService {}`
  },
  {
    dir: "service",
    name: "EmailNotificationService",
    code: `package com.codeatlas.enterprise.service;
import org.springframework.stereotype.Service;
@Service
public class EmailNotificationService {}`
  },

  // Controllers
  {
    dir: "controller",
    name: "VehicleController",
    code: `package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.service.VehicleService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class VehicleController {
    private final VehicleService vehicleService;
    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }
}`
  },
  {
    dir: "controller",
    name: "DriverController",
    code: `package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.service.DriverService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class DriverController {
    private final DriverService driverService;
    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }
}`
  },
  {
    dir: "controller",
    name: "RouteController",
    code: `package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.service.RouteService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class RouteController {
    private final RouteService routeService;
    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }
}`
  },
  {
    dir: "controller",
    name: "TripController",
    code: `package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.service.TripService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class TripController {
    private final TripService tripService;
    public TripController(TripService tripService) {
        this.tripService = tripService;
    }
}`
  },
  {
    dir: "controller",
    name: "GpsController",
    code: `package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.service.GpsTrackingService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class GpsController {
    private final GpsTrackingService gpsTrackingService;
    public GpsController(GpsTrackingService gpsTrackingService) {
        this.gpsTrackingService = gpsTrackingService;
    }
}`
  },
  {
    dir: "controller",
    name: "MaintenanceController",
    code: `package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.service.MaintenanceService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class MaintenanceController {
    private final MaintenanceService maintenanceService;
    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }
}`
  },
  {
    dir: "controller",
    name: "FuelController",
    code: `package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.repository.FuelLogRepository;
import com.codeatlas.enterprise.service.FuelManagementService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class FuelController {
    private final FuelLogRepository fuelLogRepository;
    private final FuelManagementService fuelManagementService;
    public FuelController(FuelLogRepository fuelLogRepository, FuelManagementService fuelManagementService) {
        this.fuelLogRepository = fuelLogRepository;
        this.fuelManagementService = fuelManagementService;
    }
}`
  },
  {
    dir: "controller",
    name: "InvoiceController",
    code: `package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.service.InvoiceService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class InvoiceController {
    private final InvoiceService invoiceService;
    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }
}`
  },
  {
    dir: "controller",
    name: "PaymentController",
    code: `package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.repository.PaymentRepository;
import com.codeatlas.enterprise.service.PaymentService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class PaymentController {
    private final PaymentRepository paymentRepository;
    private final PaymentService paymentService;
    public PaymentController(PaymentRepository paymentRepository, PaymentService paymentService) {
        this.paymentRepository = paymentRepository;
        this.paymentService = paymentService;
    }
}`
  },
  {
    dir: "controller",
    name: "AnalyticsController",
    code: `package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.service.AnalyticsService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class AnalyticsController {
    private final AnalyticsService analyticsService;
    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }
}`
  },
  {
    dir: "controller",
    name: "AuthController",
    code: `package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.service.AuthService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }
}`
  },
  {
    dir: "controller",
    name: "UserController",
    code: `package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.service.UserService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class UserController {
    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }
}`
  },

  // Configuration, Clients, Utilities, Events, Exception, DTOs
  {
    dir: "",
    name: "DemoApplication",
    code: `package com.codeatlas.enterprise;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}`
  },
  {
    dir: "config",
    name: "SecurityConfig",
    code: `package com.codeatlas.enterprise.config;
import org.springframework.context.annotation.Configuration;
@Configuration
public class SecurityConfig {}`
  },
  {
    dir: "exception",
    name: "GlobalExceptionHandler",
    code: `package com.codeatlas.enterprise.exception;
import org.springframework.web.bind.annotation.ControllerAdvice;
@ControllerAdvice
public class GlobalExceptionHandler {}`
  },
  {
    dir: "events",
    name: "GpsEvent",
    code: `package com.codeatlas.enterprise.events;
public class GpsEvent {
    private Double latitude;
    private Double longitude;
}`
  },
  {
    dir: "listeners",
    name: "GpsEventListener",
    code: `package com.codeatlas.enterprise.listeners;
import com.codeatlas.enterprise.events.GpsEvent;
import org.springframework.stereotype.Component;
@Component
public class GpsEventListener {
    public void onGps(GpsEvent event) {}
}`
  },
  {
    dir: "client",
    name: "MapsClient",
    code: `package com.codeatlas.enterprise.client;
import org.springframework.stereotype.Component;
@Component
public class MapsClient {}`
  },
  {
    dir: "util",
    name: "FleetUtils",
    code: `package com.codeatlas.enterprise.util;
public class FleetUtils {}`
  },
  {
    dir: "dto",
    name: "VehicleDto",
    code: `package com.codeatlas.enterprise.dto;
public class VehicleDto {
    private String plateNumber;
}`
  },
  {
    dir: "dto",
    name: "DriverDto",
    code: `package com.codeatlas.enterprise.dto;
public class DriverDto {
    private String name;
}`
  },
  {
    dir: "dto",
    name: "TripDto",
    code: `package com.codeatlas.enterprise.dto;
public class TripDto {
    private Long vehicleId;
}`
  }
];

files.forEach(f => {
  const dirPath = f.dir ? path.join(baseDir, f.dir) : baseDir;
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const filePath = path.join(dirPath, `${f.name}.java`);
  fs.writeFileSync(filePath, f.code, "utf8");
  console.log(`Generated ${filePath}`);
});

console.log("Enterprise demo generation complete!");
