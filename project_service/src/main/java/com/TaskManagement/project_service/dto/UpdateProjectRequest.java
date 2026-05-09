package com.TaskManagement.project_service.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateProjectRequest {

    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @Future(message = "Deadline must be in the future")
    private LocalDate deadline;

    private String priority;
    private String status;
}
