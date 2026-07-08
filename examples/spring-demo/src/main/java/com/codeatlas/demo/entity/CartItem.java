package com.codeatlas.demo.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class CartItem {
    @Id
    private Long id;
    private Long cartId;
    private Long productId;
    private Integer quantity;

    public Long getId() { return id; }
    public Long getCartId() { return cartId; }
    public Long getProductId() { return productId; }
    public Integer getQuantity() { return quantity; }
}
