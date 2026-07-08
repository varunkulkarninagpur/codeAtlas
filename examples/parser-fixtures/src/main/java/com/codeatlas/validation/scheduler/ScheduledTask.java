package com.codeatlas.validation.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

// EXPECT: Component: none
// EXPECT: Depends On: none
// EXPECT: Violation: none
@Component
public class ScheduledTask {

    @Scheduled(fixedRate = 5000)
    public void runTask() {
    }
}
