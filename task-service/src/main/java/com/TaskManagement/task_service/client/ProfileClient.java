package com.TaskManagement.task_service.client;

import com.TaskManagement.task_service.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

// ✅ صح - بيستخدم Eureka service discovery
@FeignClient(name = "PROFILE-SERVICE", configuration = FeignConfig.class)
public interface ProfileClient {

    @PutMapping("/api/profiles/{userId}/increment-completed-tasks")
    void incrementCompletedTasks(@PathVariable("userId") String userId);
}