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
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


public interface ProjectService {
    Project createProject(CreateProjectRequest createProjectRequest);

    Project updateProject(Long projectId, UpdateProjectRequest updateProjectRequest);

    Project updateProjectStatus(Long projectId, String status);

    Project getProjectById(Long projectId);

    List<Project> getAllProjects();

    List<Project> getProjectsByStatus(ProjectStatus status);

    List<Project> getLeaderProjectsView();

    List<Project> getMemberProjectsView();

    void deleteProject(Long projectId);

    Map<String, Object> getProjectWithTasks(Long projectId);
}