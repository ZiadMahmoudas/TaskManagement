package com.TaskManagement.Profile_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long profileId;

    private String userId;

    private String bio;

    private String githubUsername;

    @ElementCollection
    private List<String> technicalSkills;

    private int completedTasksCount;
}
