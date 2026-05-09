package com.TaskManagement.Profile_service.dto;

import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.validator.constraints.NotBlank;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDto {

    @NotBlank(message = "User ID is required")
    private String userId;

    @Size(max = 500, message = "Bio must not exceed 500 characters")
    private String bio;

    @Size(max = 100, message = "Github username must not exceed 100 characters")
    private String githubUsername;

    private List<String> technicalSkills;

    private int completedTasksCount;
}