package com.app.milkman.component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.lang.reflect.Method;
import java.util.Arrays;

@Slf4j
@Component
public class RoleAuthorizationInterceptor implements HandlerInterceptor {

    @Autowired
    private JWTService jwtService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Only process if it's a controller method
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        HandlerMethod handlerMethod = (HandlerMethod) handler;
        Method method = handlerMethod.getMethod();
        
        // Check if method or class has @RequireRole annotation
        RequireRole classAnnotation = handlerMethod.getBeanType().getAnnotation(RequireRole.class);
        RequireRole methodAnnotation = method.getAnnotation(RequireRole.class);
        
        RequireRole requireRole = methodAnnotation != null ? methodAnnotation : classAnnotation;
        
        if (requireRole == null) {
            // No role requirement, allow access
            return true;
        }

        // Extract token from Authorization header
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("[Authorization] No valid Authorization header found");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"status\":\"error\",\"message\":\"Unauthorized: No valid token\"}");
            return false;
        }

        String token = authHeader.substring(7);
        
        try {
            // Extract role from token
            String userRole = jwtService.extractRole(token);
            
            if (userRole == null) {
                userRole = "USER"; // Default to USER if no role in token
            }
            
            String[] requiredRoles = requireRole.value();
            boolean hasRequiredRole = Arrays.asList(requiredRoles).contains(userRole);
            
            if (!hasRequiredRole) {
                log.warn("[Authorization] User with role '{}' attempted to access endpoint requiring roles: {}",
                         userRole, Arrays.toString(requiredRoles));
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json");
                response.getWriter().write("{\"status\":\"error\",\"message\":\"Forbidden: Insufficient permissions\"}");
                return false;
            }
            
            log.debug("[Authorization] Access granted for role: {}", userRole);
            return true;
            
        } catch (Exception e) {
            log.error("[Authorization] Error validating token: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"status\":\"error\",\"message\":\"Unauthorized: Invalid token\"}");
            return false;
        }
    }
}
