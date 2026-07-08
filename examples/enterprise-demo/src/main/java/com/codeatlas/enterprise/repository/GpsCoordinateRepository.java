package com.codeatlas.enterprise.repository;
import com.codeatlas.enterprise.entity.GpsCoordinate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface GpsCoordinateRepository extends JpaRepository<GpsCoordinate, Long> {}