package com.codeatlas.enterprise.repository;
import com.codeatlas.enterprise.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {}