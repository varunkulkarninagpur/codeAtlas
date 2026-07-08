package com.codeatlas.demo.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Order {
    @Id
    private Long id;
    private Long userId;
    private String status;

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getStatus() { return status; }
}
