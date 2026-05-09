package com.TaskManagement.project_service.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateProjectRequest {
    private String title;
    private String description;
    private LocalDate deadline;
    private String priority;
    private String status;
}