package com.codeatlas.enterprise.repository;
import com.codeatlas.enterprise.entity.MaintenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, Long> {}