package com.codeatlas.demo.repository;

// EXPECT: COMPONENT: REPOSITORY

import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomBaseRepo<T, ID> extends JpaRepository<T, ID> {
}
