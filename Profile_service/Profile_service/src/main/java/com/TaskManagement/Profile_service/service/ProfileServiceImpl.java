package com.TaskManagement.Profile_service.service;

import com.TaskManagement.Profile_service.dto.ProfileDto;
import com.TaskManagement.Profile_service.entity.Profile;
import com.TaskManagement.Profile_service.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {
    @Autowired
    private  ProfileRepository profileRepository;

    @Override
    public ProfileDto getProfileByUserId(String userId) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found for user: " + userId));
        return mapToDto(profile);
    }

    @Override
    public ProfileDto updateProfile(String userId, ProfileDto profileDto) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found for user: " + userId));

        profile.setBio(profileDto.getBio());
        profile.setGithubUsername(profileDto.getGithubUsername());
        profile.setTechnicalSkills(profileDto.getTechnicalSkills());

        return mapToDto(profileRepository.save(profile));
    }

    @Override
    public ProfileDto createProfile(ProfileDto profileDto) {
        Profile profile = Profile.builder()
                .userId(profileDto.getUserId())
                .bio(profileDto.getBio())
                .githubUsername(profileDto.getGithubUsername())
                .technicalSkills(profileDto.getTechnicalSkills())
                .completedTasksCount(0)
                .build();

        return mapToDto(profileRepository.save(profile));
    }

    private ProfileDto mapToDto(Profile profile) {
        return ProfileDto.builder()
                .userId(profile.getUserId())
                .bio(profile.getBio())
                .githubUsername(profile.getGithubUsername())
                .technicalSkills(profile.getTechnicalSkills())
                .completedTasksCount(profile.getCompletedTasksCount())
                .build();
    }
    public void incrementCompletedTasks(String userId) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found for user: " + userId));
        profile.setCompletedTasksCount(profile.getCompletedTasksCount() + 1);
        profileRepository.save(profile);
    }
}
