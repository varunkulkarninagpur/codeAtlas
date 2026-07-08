package com.codeatlas.validation.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.cache.annotation.EnableCaching;

// EXPECT: Component: none
// EXPECT: Depends On: none
// EXPECT: Violation: none
@Configuration
@ComponentScan(basePackages = "com.codeatlas.validation")
@EnableScheduling
@EnableAsync
@EnableCaching
public class AppConfig {

    @Bean
    public CustomBean customBean() {
        return new CustomBean();
    }
}
