package com.codeatlas.validation.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Lazy;
import lombok.RequiredArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Queue;
import java.util.Optional;
import java.util.function.Supplier;
import java.util.function.Function;
import java.util.function.Consumer;
import java.util.stream.Stream;

import com.codeatlas.validation.service.ValidationService;
import com.codeatlas.validation.repository.ValidationRepository;
import com.codeatlas.validation.entity.ValidationEntity;
import com.codeatlas.validation.dto.ValidationDTO;

// EXPECT: Component: SERVICE
// EXPECT: Stereotype: @Service
// EXPECT: Type: class
// EXPECT: Extends: none
// EXPECT: Implements: ValidationService
// EXPECT: Depends On: ValidationService, ValidationRepository, ValidationEntity, ValidationDTO
// EXPECT: Violation: none
@Service
@Lazy
@Getter
@Setter
public class ValidationServiceImpl implements ValidationService {

    private final ValidationRepository validationRepository;
    
    // Field injection, qualifier, lazy
    @Autowired
    @Qualifier("mainRepository")
    @Lazy
    private ValidationRepository lazyRepository;

    // Generics & Collections
    private List<ValidationService> serviceList;
    private Set<ValidationService> serviceSet;
    private Map<String, ValidationService> serviceMap;
    private Queue<ValidationService> serviceQueue;

    // Nested Generics
    private Map<String, List<ValidationService>> nestedServiceMap;
    private List<Map<String, ValidationDTO>> nestedDtoList;

    // Optional and Functional types
    private Optional<ValidationRepository> optionalRepository;
    private Supplier<ValidationService> serviceSupplier;
    private Function<ValidationEntity, ValidationDTO> entityToDtoFunction;
    private Consumer<ValidationEntity> entityConsumer;

    // Constructor injection
    @Autowired
    public ValidationServiceImpl(ValidationRepository validationRepository) {
        this.validationRepository = validationRepository;
    }

    public void doSomething() {
        // Lambda expression
        Stream.of("a", "b").map(x -> x.toUpperCase()).forEach(System.out::println);

        // Anonymous class
        Runnable r = new Runnable() {
            @Override
            public void run() {
                System.out.println("Running anonymous class");
            }
        };
        r.run();
    }
}
