package com.TaskManagement.Auth_services.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @AfterReturning("execution(* com.TaskManagement.Auth_services.service.AuthService.register(..))")
    public void logAfterRegister(JoinPoint joinPoint) {
        log.info("New user registered successfully.");
    }

    @AfterReturning("execution(* com.TaskManagement.Auth_services.service.AuthService.login(..))")
    public void logAfterLogin(JoinPoint joinPoint) {
        log.info("User logged in successfully.");
    }

    @AfterThrowing(
            pointcut = "execution(* com.TaskManagement.Auth_services.service.AuthService.login(..))",
            throwing = "exception"
    )
    public void logFailedLogin(JoinPoint joinPoint, Throwable exception) {
//        log.warn("Failed login attempt: {}", exception.getMessage());
    }

    @Around("execution(* com.TaskManagement.Auth_services.service.AuthService.*(..))")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long duration = System.currentTimeMillis() - start;
        log.info("[AuthService] {} executed in {}ms", joinPoint.getSignature().getName(), duration);
        return result;
    }
}
