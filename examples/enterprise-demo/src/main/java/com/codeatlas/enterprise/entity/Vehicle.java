package com.codeatlas.enterprise.entity;
import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
public class Vehicle {
    @Id
    private Long id;
    private String plateNumber;
    private String model;
}