package com.codeatlas.enterprise.entity;
import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
public class GpsCoordinate {
    @Id
    private Long id;
    private Double latitude;
    private Double longitude;
}