package com.codeatlas.demo.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class User {
    @Id
    private Long id;
    private String username;
    private String email;

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
}
