package com.codeatlas.validation.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.codeatlas.validation.entity.ValidationEntity;

// EXPECT: Component: REPOSITORY
// EXPECT: Stereotype: @Repository
// EXPECT: Type: interface
// EXPECT: Extends: CrudRepository
// EXPECT: Implements: none
// EXPECT: Depends On: ValidationEntity
// EXPECT: Violation: BYPASS_SERVICE
@Repository
public interface MyCrudRepository extends CrudRepository<ValidationEntity, Long> {
}
