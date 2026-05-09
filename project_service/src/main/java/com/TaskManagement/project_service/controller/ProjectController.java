package com.TaskManagement.project_service.controller;

import com.TaskManagement.project_service.dto.CreateProjectRequest;
import com.TaskManagement.project_service.dto.UpdateProjectRequest;
import com.TaskManagement.project_service.entity.Project;
import com.TaskManagement.project_service.entity.ProjectStatus;
import com.TaskManagement.project_service.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Project> createProject(@RequestBody CreateProjectRequest createProjectRequest) {
        return ResponseEntity.ok(projectService.createProject(createProjectRequest));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Project> updateProject(@PathVariable Long id,
                                                 @RequestBody UpdateProjectRequest updateProjectRequest) {
        return ResponseEntity.ok(projectService.updateProject(id, updateProjectRequest));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Project> updateProjectStatus(@PathVariable Long id,
                                                       @RequestParam String status) {
        return ResponseEntity.ok(projectService.updateProjectStatus(id, status));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('TEAM_LEADER') or hasRole('TEAM_MEMBER')")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('TEAM_LEADER')")
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('TEAM_LEADER')")
    public ResponseEntity<List<Project>> getProjectsByStatus(@PathVariable ProjectStatus status) {
        return ResponseEntity.ok(projectService.getProjectsByStatus(status));
    }

    @GetMapping("/leader-view")
    @PreAuthorize("hasRole('TEAM_LEADER')")
    public ResponseEntity<List<Project>> getLeaderProjectsView() {
        return ResponseEntity.ok(projectService.getLeaderProjectsView());
    }

    @GetMapping("/member-view")
    @PreAuthorize("hasRole('TEAM_MEMBER')")
    public ResponseEntity<List<Project>> getMemberProjectsView() {
        return ResponseEntity.ok(projectService.getMemberProjectsView());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<String> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok("Project deleted successfully");
    }
    @GetMapping("/{projectId}/tasks")
    @PreAuthorize("hasAnyRole('MANAGER', 'TEAM_LEADER', 'TEAM_MEMBER')")
    public ResponseEntity<Map<String, Object>> getProjectWithTasks(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.getProjectWithTasks(projectId));
    }
}