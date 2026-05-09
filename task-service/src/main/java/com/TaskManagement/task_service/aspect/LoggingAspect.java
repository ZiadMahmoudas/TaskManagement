package com.TaskManagement.task_service.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @AfterReturning("execution(* com.TaskManagement.task_service.service.TaskService.completeTask(..))")
    public void logAfterTaskComplete(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        Long taskId = (Long) args[0];
        log.info("Task with ID {} has been successfully completed.", taskId);
    }

    @AfterReturning("execution(* com.TaskManagement.task_service.service.TaskService.resetTaskStatus(..))")
    public void logAfterTaskReset(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        Long taskId = (Long) args[0];
        log.info("Task with ID {} has been reset to pending by team leader.", taskId);
    }
}