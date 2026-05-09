package com.TaskManagement.task_service.service;

import com.TaskManagement.task_service.entity.Notification;
import com.TaskManagement.task_service.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public void sendNotification(String userId, String message) {
        Notification notification = Notification.builder()
                .userId(userId)
                .message(message)
                .build();
        notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserId(userId);
    }

    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}
