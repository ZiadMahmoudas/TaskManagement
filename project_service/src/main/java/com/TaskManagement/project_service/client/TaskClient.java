package com.TaskManagement.project_service.client;

import com.TaskManagement.project_service.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "TASK-SERVICE", configuration = FeignConfig.class)
public interface TaskClient {
    @GetMapping("/api/tasks/project/{projectId}")
    List<Object> getTasksByProjectId(@PathVariable("projectId") Long projectId);
}