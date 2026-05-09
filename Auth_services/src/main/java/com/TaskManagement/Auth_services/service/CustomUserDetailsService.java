package com.TaskManagement.Auth_services.service;

import com.TaskManagement.Auth_services.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public org.springframework.security.core.userdetails.UserDetails loadUserByUsername(String username)
            throws org.springframework.security.core.userdetails.UsernameNotFoundException {

        // بندور في عمود الـ name اللي إنت عامله في الـ Entity
        com.TaskManagement.Auth_services.entity.User user = userRepository.findByName(username)
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException("User not found"));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getName())
                .password(user.getPassword()) // الباسوورد المتشفر اللي في الداتابيز
                .roles(user.getRole().name())
                .build();
    }
}
