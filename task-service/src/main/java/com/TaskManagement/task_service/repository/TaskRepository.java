package com.TaskManagement.task_service.repository;

import com.TaskManagement.task_service.entity.Task;
import com.TaskManagement.task_service.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedToUserId(Long userId);
    List<Task> findByProjectId(Long projectId);
    List<Task> findByAssignedToUserIdAndProjectId(Long userId, Long projectId);
    List<Task> findByAssignedToUserIdIsNull();
    List<Task> findByStatus(TaskStatus status);
}