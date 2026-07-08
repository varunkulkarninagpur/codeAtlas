package com.codeatlas.enterprise.repository;
import com.codeatlas.enterprise.entity.ScheduleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ScheduleItemRepository extends JpaRepository<ScheduleItem, Long> {}