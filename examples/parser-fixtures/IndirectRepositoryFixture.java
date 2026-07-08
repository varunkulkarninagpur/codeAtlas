package com.codeatlas.demo.repository;

// EXPECT: COMPONENT: REPOSITORY
// EXPECT: DEPENDS ON: MyEntity
// EXPECT: VIOLATION: none

import org.springframework.data.jpa.repository.JpaRepository;
import com.codeatlas.demo.entity.MyEntity;

public interface IndirectRepositoryFixture extends CustomBaseRepo<MyEntity, Long> {
}
