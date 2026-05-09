package com.TaskManagement.Profile_service.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @AfterReturning("execution(* com.TaskManagement.Profile_service.service.ProfileServiceImpl.createProfile(..))")
    public void logAfterProfileCreate(JoinPoint joinPoint) {
        log.info("New profile has been created.");
    }

    @AfterReturning("execution(* com.TaskManagement.Profile_service.service.ProfileServiceImpl.updateProfile(..))")
    public void logAfterProfileUpdate(JoinPoint joinPoint) {
        String userId = (String) joinPoint.getArgs()[0];
        log.info("Profile for user [{}] has been updated.", userId);
    }

    @AfterReturning("execution(* com.TaskManagement.Profile_service.service.ProfileServiceImpl.getProfileByUserId(..))")
    public void logAfterProfileFetch(JoinPoint joinPoint) {
        String userId = (String) joinPoint.getArgs()[0];
        log.info("Profile for user [{}] has been fetched.", userId);
    }

    @AfterReturning("execution(* com.TaskManagement.Profile_service.service.ProfileServiceImpl.incrementCompletedTasks(..))")
    public void logAfterIncrementTasks(JoinPoint joinPoint) {
        String userId = (String) joinPoint.getArgs()[0];
        log.info("Completed tasks count incremented for user [{}].", userId);
    }

    @Around("execution(* com.TaskManagement.Profile_service.service.ProfileServiceImpl.*(..))")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long duration = System.currentTimeMillis() - start;
        log.info("[ProfileService] {} executed in {}ms", joinPoint.getSignature().getName(), duration);
        return result;
    }

    @AfterThrowing(
            pointcut = "execution(* com.TaskManagement.Profile_service.service.ProfileServiceImpl.*(..))",
            throwing = "exception"
    )
    public void logException(JoinPoint joinPoint, Throwable exception) {
        log.error("[ProfileService] {} threw: {}", joinPoint.getSignature().getName(), exception.getMessage());
    }
}

