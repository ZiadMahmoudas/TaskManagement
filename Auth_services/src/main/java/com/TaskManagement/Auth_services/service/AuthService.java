package com.TaskManagement.Auth_services.service;

import com.TaskManagement.Auth_services.DTOs.AuthResponse;
import com.TaskManagement.Auth_services.DTOs.LoginRequest;
import com.TaskManagement.Auth_services.entity.Role;
import com.TaskManagement.Auth_services.entity.User;
import com.TaskManagement.Auth_services.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    public User register(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    public AuthResponse login(LoginRequest loginRequest) {
        // 1. Authenticate
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        // 2. هات اليوزر عشان ناخد بياناته
        User user = userRepository.findByName(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. جهز الـ Claims اللي عايز تحطها جوه التوكين
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", user.getId());
        extraClaims.put("roles", List.of(user.getRole().name()));

        String token = jwtService.generateToken(extraClaims, user.getName());

        return new AuthResponse(token);
    }
    public List<User> getAllTeamMembers() {
        return userRepository.findByRole(Role.TEAM_MEMBER);
    }

    public List<User> getAllTeamLeaders() {
        return userRepository.findByRole(Role.TEAM_LEADER);
    }

}
