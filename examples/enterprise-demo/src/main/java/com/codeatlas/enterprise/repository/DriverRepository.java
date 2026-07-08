package com.codeatlas.enterprise.repository;
import com.codeatlas.enterprise.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {}