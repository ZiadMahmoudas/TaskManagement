package com.TaskManagement.task_service.service;

import com.TaskManagement.task_service.client.ProfileClient;
import com.TaskManagement.task_service.config.JwtService;
import com.TaskManagement.task_service.dto.CreateTaskRequest;
import com.TaskManagement.task_service.entity.Task;
import com.TaskManagement.task_service.entity.TaskStatus;
import com.TaskManagement.task_service.exception.InvalidTaskStateException;
import com.TaskManagement.task_service.exception.TaskNotFoundException;
import com.TaskManagement.task_service.exception.UnauthorizedTaskActionException;
import com.TaskManagement.task_service.repository.TaskRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final NotificationService notificationService;
    private final TaskRepository taskRepository;
    private final JwtService jwtService;
    private final HttpServletRequest request;
    private final ProfileClient profileClient;

    public Task createTask(CreateTaskRequest createTaskRequest) {
        Task task = Task.builder()
                .title(createTaskRequest.getTitle())
                .description(createTaskRequest.getDescription())
                .priority(createTaskRequest.getPriority())
                .projectId(createTaskRequest.getProjectId())
                .status(TaskStatus.INCOMPLETE)
                .build();

        return taskRepository.save(task);
    }

    public Task assignTask(Long taskId, Long userId) {
        Task task = getTaskOrThrow(taskId);
        task.setAssignedToUserId(userId);
        Task savedTask = taskRepository.save(task);

        // Notification للـ Team Member
        notificationService.sendNotification(
                userId.toString(),
                "Task '" + task.getTitle() + "' has been assigned to you"
        );

        return savedTask;
    }

    public Task startTask(Long taskId) {
        Task task = getTaskOrThrow(taskId);
        Long currentUserId = getCurrentUserId();

        validateTaskAssignedToCurrentUser(task, currentUserId);

        if (task.getStatus() == TaskStatus.COMPLETE) {
            throw new InvalidTaskStateException("Completed task cannot be started again");
        }

        if (task.getStatus() == TaskStatus.PENDING) {
            throw new InvalidTaskStateException("Task is already in progress");
        }

        task.setStatus(TaskStatus.PENDING);
        return taskRepository.save(task);
    }

    public Task completeTask(Long taskId, String githubLink) {
        Task task = getTaskOrThrow(taskId);
        Long currentUserId = getCurrentUserId();

        validateTaskAssignedToCurrentUser(task, currentUserId);

        if (task.getStatus() != TaskStatus.PENDING) {
            throw new InvalidTaskStateException("Only pending tasks can be completed");
        }

        task.setStatus(TaskStatus.COMPLETE);
        task.setGithubLink(githubLink);
        Task savedTask = taskRepository.save(task);

        // إخبار الـ Profile Service إن التاسك خلصت
        profileClient.incrementCompletedTasks(currentUserId.toString());

        return savedTask;
    }

    public Task resetTaskStatus(Long taskId) {
        Task task = getTaskOrThrow(taskId);

        if (task.getStatus() != TaskStatus.COMPLETE) {
            throw new InvalidTaskStateException("Only completed tasks can be reset");
        }

        task.setStatus(TaskStatus.PENDING);
        Task savedTask = taskRepository.save(task);

        // Notification للـ Team Member إن الـ Task اترفضت
        notificationService.sendNotification(
                task.getAssignedToUserId().toString(),
                "Your task '" + task.getTitle() + "' has been rejected. Please fix the issue."
        );

        return savedTask;
    }

    public Task verifyTask(Long taskId) {
        Task task = getTaskOrThrow(taskId);
        if (task.getStatus() != TaskStatus.COMPLETE) {
            throw new InvalidTaskStateException("Only completed tasks can be verified");
        }
        task.setVerified(true);

        // notification للـ member
        notificationService.sendNotification(
                task.getAssignedToUserId().toString(),
                "Your task '" + task.getTitle() + "' has been verified successfully! ✅"
        );

        return taskRepository.save(task);
    }

    public Task getTaskById(Long taskId) {
        Task task = getTaskOrThrow(taskId);
        Long currentUserId = getCurrentUserId();

        if (isTeamMember() && !isTaskAssignedToCurrentUser(task, currentUserId)) {
            throw new UnauthorizedTaskActionException("You are not allowed to view this task");
        }

        return task;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getMyTasks() {
        Long currentUserId = getCurrentUserId();
        return taskRepository.findByAssignedToUserId(currentUserId);
    }

    public List<Task> getTasksByUserId(Long userId) {
        Long currentUserId = getCurrentUserId();

        if (isTeamMember() && !currentUserId.equals(userId)) {
            throw new UnauthorizedTaskActionException("You are not allowed to view other users tasks");
        }

        return taskRepository.findByAssignedToUserId(userId);
    }

    public List<Task> getTasksByProjectId(Long projectId) {
        if (isTeamMember()) {
            Long currentUserId = getCurrentUserId();
            return taskRepository.findByAssignedToUserIdAndProjectId(currentUserId, projectId);
        }

        return taskRepository.findByProjectId(projectId);
    }

    public List<Task> getUnassignedTasks() {
        return taskRepository.findByAssignedToUserIdIsNull();
    }

    public List<Task> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status);
    }

    private Task getTaskOrThrow(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task not found"));
    }

    private void validateTaskAssignedToCurrentUser(Task task, Long currentUserId) {
        if (task.getAssignedToUserId() == null) {
            throw new InvalidTaskStateException("Task is not assigned to any user");
        }

        if (!task.getAssignedToUserId().equals(currentUserId)) {
            throw new UnauthorizedTaskActionException("You are not allowed to update this task");
        }
    }

    private boolean isTaskAssignedToCurrentUser(Task task, Long currentUserId) {
        return task.getAssignedToUserId() != null && task.getAssignedToUserId().equals(currentUserId);
    }

    private Long getCurrentUserId() {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedTaskActionException("Authorization header is missing or invalid");
        }

        String token = authHeader.substring(7);
        return jwtService.extractUserId(token);
    }

    private boolean isTeamMember() {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return false;
        }

        String token = authHeader.substring(7);
        List<String> roles = jwtService.extractRoles(token);

        return roles.contains("TEAM_MEMBER");
    }
}