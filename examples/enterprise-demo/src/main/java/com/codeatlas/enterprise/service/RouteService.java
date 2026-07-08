package com.codeatlas.enterprise.service;
import com.codeatlas.enterprise.repository.RouteRepository;
import org.springframework.stereotype.Service;
@Service
public class RouteService {
    private final RouteRepository routeRepository;
    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }
}