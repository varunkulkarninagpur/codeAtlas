package com.codeatlas.enterprise.entity;
import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
public class Driver {
    @Id
    private Long id;
    private String name;
    private String licenseNumber;
}