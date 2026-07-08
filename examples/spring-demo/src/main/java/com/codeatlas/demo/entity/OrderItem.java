package com.codeatlas.demo.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class OrderItem {
    @Id
    private Long id;
    private Long orderId;
    private Long productId;
    private Integer quantity;

    public Long getId() { return id; }
    public Long getOrderId() { return orderId; }
    public Long getProductId() { return productId; }
    public Integer getQuantity() { return quantity; }
}
