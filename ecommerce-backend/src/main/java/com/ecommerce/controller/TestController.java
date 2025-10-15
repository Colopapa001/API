package com.ecommerce.controller;

import com.ecommerce.model.User;
import com.ecommerce.model.Role;
import com.ecommerce.service.UserService;
import com.ecommerce.dto.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "*")
public class TestController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/create-test-user")
    public ResponseEntity<Map<String, Object>> createTestUser() {
        try {
            // Create a simple test user
            RegisterRequest registerRequest = new RegisterRequest();
            registerRequest.setUsername("testuser");
            registerRequest.setEmail("test@test.com");
            registerRequest.setPassword("Password123");
            registerRequest.setFirstName("Test");
            registerRequest.setLastName("User");
            registerRequest.setRole(Role.USER);
            
            User savedUser = userService.createUser(registerRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Test user created successfully");
            response.put("user", Map.of(
                "id", savedUser.getId(),
                "username", savedUser.getUsername(),
                "email", savedUser.getEmail(),
                "role", savedUser.getRole()
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error creating test user: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Backend is running");
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/reset-passwords")
    public ResponseEntity<Map<String, Object>> resetPasswords() {
        try {
            // Reset all test user passwords to Password123
            userService.resetUserPassword("admin@ecommerce.com", "Password123");
            userService.resetUserPassword("seller1@ecommerce.com", "Password123");
            userService.resetUserPassword("user1@ecommerce.com", "Password123");
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "All test user passwords reset to 'Password123'");
            response.put("users", new String[]{"admin@ecommerce.com", "seller1@ecommerce.com", "user1@ecommerce.com"});
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error resetting passwords: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
