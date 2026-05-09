package com.TaskManagement.Auth_services.service;

import com.TaskManagement.Auth_services.DTOs.AuthResponse;
import com.TaskManagement.Auth_services.DTOs.LoginRequest;
import com.TaskManagement.Auth_services.entity.User;

import java.util.List;

public interface AuthService {

    User register(User user);

    AuthResponse login(LoginRequest loginRequest);

    List<User> getAllTeamMembers();

    List<User> getAllTeamLeaders();
}