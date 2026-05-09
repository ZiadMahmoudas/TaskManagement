package com.TaskManagement.task_service.controller;

import com.TaskManagement.task_service.dto.CreateTaskRequest;
import com.TaskManagement.task_service.entity.Task;
import com.TaskManagement.task_service.entity.TaskStatus;
import com.TaskManagement.task_service.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Task> createTask(@RequestBody CreateTaskRequest createTaskRequest) {
        return ResponseEntity.ok(taskService.createTask(createTaskRequest));
    }

    @PutMapping("/{id}/assign/{userId}")
    @PreAuthorize("hasRole('TEAM_LEADER')")
    public ResponseEntity<Task> assignTask(@PathVariable Long id, @PathVariable Long userId) {
        return ResponseEntity.ok(taskService.assignTask(id, userId));
    }

    @PutMapping("/{id}/start")
    @PreAuthorize("hasRole('TEAM_MEMBER')")
    public ResponseEntity<Task> startTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.startTask(id));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('TEAM_MEMBER')")
    public ResponseEntity<Task> completeTask(@PathVariable Long id,
                                             @RequestParam(required = false) String githubLink) {
        return ResponseEntity.ok(taskService.completeTask(id, githubLink));
    }

    @PutMapping("/{id}/reset")
    @PreAuthorize("hasRole('TEAM_LEADER')")
    public ResponseEntity<Task> resetTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.resetTaskStatus(id));
    }

    @PutMapping("/{id}/verify")
    @PreAuthorize("hasRole('TEAM_LEADER')")
    public ResponseEntity<Task> verifyTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.verifyTask(id));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('TEAM_LEADER') or hasRole('TEAM_MEMBER')")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('TEAM_LEADER')")
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/my-tasks")
    @PreAuthorize("hasRole('TEAM_MEMBER')")
    public ResponseEntity<List<Task>> getMyTasks() {
        return ResponseEntity.ok(taskService.getMyTasks());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('TEAM_LEADER') or hasRole('TEAM_MEMBER')")
    public ResponseEntity<List<Task>> getTasksByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(taskService.getTasksByUserId(userId));
    }

    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('TEAM_LEADER') or hasRole('TEAM_MEMBER')")
    public ResponseEntity<List<Task>> getTasksByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(taskService.getTasksByProjectId(projectId));
    }

    @GetMapping("/unassigned")
    @PreAuthorize("hasRole('TEAM_LEADER')")
    public ResponseEntity<List<Task>> getUnassignedTasks() {
        return ResponseEntity.ok(taskService.getUnassignedTasks());
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('TEAM_LEADER')")
    public ResponseEntity<List<Task>> getTasksByStatus(@PathVariable TaskStatus status) {
        return ResponseEntity.ok(taskService.getTasksByStatus(status));
    }
}