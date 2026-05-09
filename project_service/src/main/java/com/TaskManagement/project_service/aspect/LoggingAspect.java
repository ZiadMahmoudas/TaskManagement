package com.TaskManagement.project_service.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @AfterReturning("execution(* com.TaskManagement.project_service.service.ProjectService.createProject(..))")
    public void logAfterProjectCreate(JoinPoint joinPoint) {
        log.info("New project has been created.");
    }

    @AfterReturning("execution(* com.TaskManagement.project_service.service.ProjectService.deleteProject(..))")
    public void logAfterProjectDelete(JoinPoint joinPoint) {
        Long projectId = (Long) joinPoint.getArgs()[0];
        log.info("Project [{}] has been deleted.", projectId);
    }

    @AfterReturning("execution(* com.TaskManagement.project_service.service.ProjectService.updateProjectStatus(..))")
    public void logAfterStatusChange(JoinPoint joinPoint) {
        Long projectId = (Long) joinPoint.getArgs()[0];
        String newStatus = (String) joinPoint.getArgs()[1];
        log.info("Project [{}] status changed to [{}].", projectId, newStatus);
    }

    @Around("execution(* com.TaskManagement.project_service.service.ProjectService.*(..))")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long duration = System.currentTimeMillis() - start;
        log.info("[ProjectService] {} executed in {}ms", joinPoint.getSignature().getName(), duration);
        return result;
    }

    @AfterThrowing(
            pointcut = "execution(* com.TaskManagement.project_service.service.ProjectService.*(..))",
            throwing = "exception"
    )
    public void logException(JoinPoint joinPoint, Throwable exception) {
        log.error("[ProjectService] {} threw: {}", joinPoint.getSignature().getName(), exception.getMessage());
    }
}
