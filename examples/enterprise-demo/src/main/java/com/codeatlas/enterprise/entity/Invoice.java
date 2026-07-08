package com.codeatlas.enterprise.entity;
import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
public class Invoice {
    @Id
    private Long id;
    private Double amount;
}