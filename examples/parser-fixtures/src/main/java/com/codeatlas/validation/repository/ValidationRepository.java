package com.codeatlas.validation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.codeatlas.validation.entity.ValidationEntity;

// EXPECT: Component: REPOSITORY
// EXPECT: Stereotype: @Repository
// EXPECT: Type: interface
// EXPECT: Extends: JpaRepository
// EXPECT: Implements: none
// EXPECT: Depends On: ValidationEntity
// EXPECT: Violation: none
@Repository
public interface ValidationRepository extends JpaRepository<ValidationEntity, Long> {
}
