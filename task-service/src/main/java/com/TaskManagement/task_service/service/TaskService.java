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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


public interface TaskService  {
    Task createTask(CreateTaskRequest createTaskRequest);

    Task assignTask(Long taskId, Long userId);

    Task startTask(Long taskId);

    Task completeTask(Long taskId, String githubLink);

    Task resetTaskStatus(Long taskId);

    Task verifyTask(Long taskId);

    Task getTaskById(Long taskId);

    List<Task> getAllTasks();

    List<Task> getMyTasks();

    List<Task> getTasksByUserId(Long userId);

    List<Task> getTasksByProjectId(Long projectId);

    List<Task> getUnassignedTasks();

    List<Task> getTasksByStatus(TaskStatus status);
}