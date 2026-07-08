package com.codeatlas.enterprise.entity;
import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
public class Trip {
    @Id
    private Long id;
    private Long vehicleId;
    private Long driverId;
    private Long routeId;
}