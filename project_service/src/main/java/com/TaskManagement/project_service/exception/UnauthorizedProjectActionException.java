package com.TaskManagement.project_service.exception;

public class UnauthorizedProjectActionException extends RuntimeException {
    public UnauthorizedProjectActionException(String message) {
        super(message);
    }
}