package com.TaskManagement.Auth_services.repository;

import com.TaskManagement.Auth_services.entity.Role;
import com.TaskManagement.Auth_services.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByName(String name);
    List<User> findByRole(Role role);
}
