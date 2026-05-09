package com.TaskManagement.project_service.controller;

import com.TaskManagement.project_service.entity.Notification;
import com.TaskManagement.project_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    @Autowired
    private  NotificationService notificationService;

    @GetMapping("/{userId}")
    @PreAuthorize("hasAnyRole('TEAM_MEMBER', 'TEAM_LEADER', 'MANAGER')")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable String userId) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    @PutMapping("/{notificationId}/read")
    @PreAuthorize("hasAnyRole('TEAM_MEMBER', 'TEAM_LEADER', 'MANAGER')")
    public ResponseEntity<Void> markAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok().build();
    }
}
