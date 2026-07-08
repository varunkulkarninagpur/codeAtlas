package com.codeatlas.validation.entity;

import javax.persistence.Entity;
import javax.persistence.Embedded;
import javax.persistence.EmbeddedId;
import javax.persistence.OneToOne;
import javax.persistence.OneToMany;
import javax.persistence.ManyToOne;
import javax.persistence.ManyToMany;
import java.util.List;

// EXPECT: Component: ENTITY
// EXPECT: Stereotype: @Entity
// EXPECT: Type: class
// EXPECT: Extends: BaseAuditEntity
// EXPECT: Implements: none
// EXPECT: Depends On: BaseAuditEntity, ValidationId, EmbeddableAddress
// EXPECT: Violation: none
@Entity
public class ValidationEntity extends BaseAuditEntity {

    @EmbeddedId
    private ValidationId id;

    @Embedded
    private EmbeddableAddress address;

    @OneToOne
    private ValidationEntity selfRef;

    @ManyToOne
    private ValidationEntity parent;

    @OneToMany(mappedBy = "parent")
    private List<ValidationEntity> children;

    @ManyToMany
    private List<ValidationEntity> relatedEntities;
}
