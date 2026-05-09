package com.TaskManagement.Profile_service.service;

import com.TaskManagement.Profile_service.dto.ProfileDto;

public interface ProfileService {
    ProfileDto getProfileByUserId(String userId);
    ProfileDto updateProfile(String userId, ProfileDto profileDto);
    ProfileDto createProfile(ProfileDto profileDto);
    public void incrementCompletedTasks(String userId);
}
