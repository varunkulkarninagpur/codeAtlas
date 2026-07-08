package com.codeatlas.demo.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Cart {
    @Id
    private Long id;
    private Long userId;

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
}
