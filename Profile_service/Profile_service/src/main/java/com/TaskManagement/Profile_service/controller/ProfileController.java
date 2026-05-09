package com.TaskManagement.Profile_service.controller;

import com.TaskManagement.Profile_service.dto.ProfileDto;
import com.TaskManagement.Profile_service.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    // Team Leader & Manager - يشوف Profile أي Member
    @GetMapping("/{userId}")
    @PreAuthorize("hasAnyAuthority('TEAM_MEMBER', 'TEAM_LEADER', 'MANAGER')")
    public ResponseEntity<ProfileDto> getProfile(@PathVariable String userId) {
        return ResponseEntity.ok(profileService.getProfileByUserId(userId));
    }

    // Team Member - يعمل Profile جديد
    @PostMapping
    @PreAuthorize("hasAuthority('TEAM_MEMBER')")
    public ResponseEntity<ProfileDto> createProfile(@RequestBody ProfileDto profileDto) {
        return ResponseEntity.ok(profileService.createProfile(profileDto));
    }

    // Team Member - يعدل Skills بتاعته بس
    @PutMapping("/{userId}")
    @PreAuthorize("hasAuthority('TEAM_MEMBER')")
    public ResponseEntity<ProfileDto> updateProfile(
            @PathVariable String userId,
            @RequestBody ProfileDto profileDto) {
        return ResponseEntity.ok(profileService.updateProfile(userId, profileDto));
    }
    @PutMapping("/{userId}/increment-completed-tasks")
    public ResponseEntity<Void> incrementCompletedTasks(@PathVariable String userId) {
        profileService.incrementCompletedTasks(userId);
        return ResponseEntity.ok().build();
    }
}
