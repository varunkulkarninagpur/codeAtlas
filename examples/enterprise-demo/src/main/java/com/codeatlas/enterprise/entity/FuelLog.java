package com.codeatlas.enterprise.entity;
import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
public class FuelLog {
    @Id
    private Long id;
    private Long vehicleId;
    private Double gallons;
}