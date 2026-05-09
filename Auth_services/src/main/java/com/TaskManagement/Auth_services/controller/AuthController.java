package com.TaskManagement.Auth_services.controller;

import com.TaskManagement.Auth_services.DTOs.AuthResponse;
import com.TaskManagement.Auth_services.DTOs.LoginRequest;
import com.TaskManagement.Auth_services.entity.User;
import com.TaskManagement.Auth_services.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}