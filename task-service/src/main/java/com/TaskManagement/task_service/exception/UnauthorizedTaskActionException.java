package com.TaskManagement.task_service.exception;

public class UnauthorizedTaskActionException extends RuntimeException {
    public UnauthorizedTaskActionException(String message) {
        super(message);
    }
}