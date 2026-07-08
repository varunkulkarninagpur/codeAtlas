package com.codeatlas.enterprise.service;
import com.codeatlas.enterprise.repository.TripRepository;
import org.springframework.stereotype.Service;
@Service
public class TripService {
    private final TripRepository tripRepository;
    public TripService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }
}