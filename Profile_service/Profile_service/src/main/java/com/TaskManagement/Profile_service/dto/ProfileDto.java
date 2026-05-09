package com.TaskManagement.Profile_service.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDto {
    private String userId;
    private String bio;
    private String githubUsername;
    private List<String> technicalSkills;
    private int completedTasksCount;
}