package com.TaskManagement.Auth_services.controller;

import com.TaskManagement.Auth_services.DTOs.AuthResponse;
import com.TaskManagement.Auth_services.DTOs.LoginRequest;
import com.TaskManagement.Auth_services.entity.User;
import com.TaskManagement.Auth_services.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        User savedUser = authService.register(user);
        return ResponseEntity.ok("User registered successfully with ID: " + savedUser.getId());
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse result = authService.login(loginRequest);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            // لو البيانات غلط يرجع 401 بدل ما يضرب 500
            return ResponseEntity.status(401).body("Invalid username or password!");
        }
    }
    @GetMapping("/team-members")
    public ResponseEntity<?> getAllTeamMembers() {
        try {
            List<User> members = authService.getAllTeamMembers();
            return ResponseEntity.ok(members);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Something went wrong!");
        }
    }

    @GetMapping("/team-leaders")
    public ResponseEntity<?> getAllTeamLeaders() {
        try {
            List<User> leaders = authService.getAllTeamLeaders();
            return ResponseEntity.ok(leaders);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Something went wrong!");
        }
    }
}