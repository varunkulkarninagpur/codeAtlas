package com.codeatlas.demo.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Product {
    @Id
    private Long id;
    private String name;
    private Double price;

    public Long getId() { return id; }
    public String getName() { return name; }
    public Double getPrice() { return price; }
}
