package com.codeatlas.enterprise.listeners;
import com.codeatlas.enterprise.events.GpsEvent;
import org.springframework.stereotype.Component;
@Component
public class GpsEventListener {
    public void onGps(GpsEvent event) {}
}