package com.TaskManagement.task_service.dto;

import lombok.Data;

@Data
public class CreateTaskRequest {
    private String title;
    private String description;
    private String priority;
    private Long projectId;
}