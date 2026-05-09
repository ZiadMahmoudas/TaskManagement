package com.TaskManagement.project_service.repository;

import com.TaskManagement.project_service.entity.Project;
import com.TaskManagement.project_service.entity.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStatus(ProjectStatus status);
}