package com.TaskManagement.project_service.service;

import com.TaskManagement.project_service.client.TaskClient;
import com.TaskManagement.project_service.config.JwtService;
import com.TaskManagement.project_service.dto.CreateProjectRequest;
import com.TaskManagement.project_service.dto.UpdateProjectRequest;
import com.TaskManagement.project_service.entity.Project;
import com.TaskManagement.project_service.entity.ProjectPriority;
import com.TaskManagement.project_service.entity.ProjectStatus;
import com.TaskManagement.project_service.exception.ProjectNotFoundException;
import com.TaskManagement.project_service.exception.UnauthorizedProjectActionException;
import com.TaskManagement.project_service.repository.ProjectRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
public class ProjectServiceImp implements ProjectService {

    @Autowired
    private  NotificationService notificationService;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private HttpServletRequest request;
    @Autowired
    private TaskClient taskClient;

    public Project createProject(CreateProjectRequest createProjectRequest) {
        Long currentUserId = getCurrentUserId();

        Project project = Project.builder()
                .title(createProjectRequest.getTitle())
                .description(createProjectRequest.getDescription())
                .deadline(createProjectRequest.getDeadline())
                .priority(parsePriority(createProjectRequest.getPriority()))
                .status(ProjectStatus.NOT_STARTED)
                .createdByManagerId(currentUserId)
                .build();

        Project savedProject = projectRepository.save(project);

        // Notification للـ Team Leader
        notificationService.sendNotification(
                String.valueOf(createProjectRequest.getTeamLeaderId()),
                "New project '" + savedProject.getTitle() + "' has been created"
        );
        return savedProject;
    }

    public Project updateProject(Long projectId, UpdateProjectRequest updateProjectRequest) {
        Project project = getProjectOrThrow(projectId);

        if (updateProjectRequest.getTitle() != null) {
            project.setTitle(updateProjectRequest.getTitle());
        }

        if (updateProjectRequest.getDescription() != null) {
            project.setDescription(updateProjectRequest.getDescription());
        }

        if (updateProjectRequest.getDeadline() != null) {
            project.setDeadline(updateProjectRequest.getDeadline());
        }

        if (updateProjectRequest.getPriority() != null) {
            project.setPriority(parsePriority(updateProjectRequest.getPriority()));
        }

        if (updateProjectRequest.getStatus() != null) {
            project.setStatus(parseStatus(updateProjectRequest.getStatus()));
        }

        return projectRepository.save(project);
    }

    public Project updateProjectStatus(Long projectId, String status) {
        Project project = getProjectOrThrow(projectId);
        project.setStatus(parseStatus(status));
        return projectRepository.save(project);
    }

    public Project getProjectById(Long projectId) {
        return getProjectOrThrow(projectId);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public List<Project> getProjectsByStatus(ProjectStatus status) {
        return projectRepository.findByStatus(status);
    }

    public List<Project> getLeaderProjectsView() {
        return projectRepository.findAll();
    }

    public List<Project> getMemberProjectsView() {
        return projectRepository.findAll();
    }

    public void deleteProject(Long projectId) {
        Project project = getProjectOrThrow(projectId);
        projectRepository.delete(project);
    }

    private Project getProjectOrThrow(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found"));
    }

    private ProjectPriority parsePriority(String priority) {
        if (priority == null || priority.isBlank()) {
            return ProjectPriority.MEDIUM;
        }

        try {
            return ProjectPriority.valueOf(priority.toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid project priority");
        }
    }

    private ProjectStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Project status is required");
        }

        try {
            return ProjectStatus.valueOf(status.toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid project status");
        }
    }

    private Long getCurrentUserId() {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedProjectActionException("Authorization header is missing or invalid");
        }

        String token = authHeader.substring(7);
        return jwtService.extractUserId(token);
    }
    public Map<String, Object> getProjectWithTasks(Long projectId) {
        Project project = getProjectOrThrow(projectId);
        List<Object> tasks = taskClient.getTasksByProjectId(projectId);

        Map<String, Object> result = new HashMap<>();
        result.put("project", project);
        result.put("tasks", tasks);

        return result;

    }
}
