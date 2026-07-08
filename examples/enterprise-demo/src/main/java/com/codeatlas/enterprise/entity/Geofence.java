package com.codeatlas.enterprise.entity;
import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
public class Geofence {
    @Id
    private Long id;
    private String name;
    private Double radius;
}