package com.codeatlas.enterprise.entity;
import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
public class Route {
    @Id
    private Long id;
    private String startLocation;
    private String endLocation;
}