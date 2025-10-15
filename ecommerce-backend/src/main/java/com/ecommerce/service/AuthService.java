package com.ecommerce.service;

import com.ecommerce.dto.AuthResponse;
import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.model.User;
import com.ecommerce.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;

@Service
public class AuthService {
    
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    
    public AuthService(AuthenticationManager authenticationManager, UserService userService, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse login(LoginRequest loginRequest) {
        try {
            // Check if user is locked
            if (userService.isUserLocked(loginRequest.getUsernameOrEmail())) {
                throw new BadCredentialsException("Account is temporarily locked due to multiple failed login attempts");
            }

            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsernameOrEmail(),
                    loginRequest.getPassword()
                )
            );

            User user = (User) authentication.getPrincipal();
            
            // Reset failed login attempts on successful login
            userService.resetFailedLoginAttempts(user.getUsername());
            
            String token = jwtUtil.generateToken(user);
            LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(jwtUtil.getExpirationTime() / 1000);
            
            log.info("User logged in successfully: {}", user.getUsername());
            
            return new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                expiresAt
            );
            
        } catch (AuthenticationException e) {
            // Increment failed login attempts
            userService.incrementFailedLoginAttempts(loginRequest.getUsernameOrEmail());
            log.error("Login failed for user: {}", loginRequest.getUsernameOrEmail());
            throw new BadCredentialsException("Invalid username/email or password");
        }
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        // Check if user already exists
        if (userService.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        
        if (userService.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        // Create new user
        User user = userService.createUser(registerRequest);
        
        // Generate token for the new user
        String token = jwtUtil.generateToken(user);
        LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(jwtUtil.getExpirationTime() / 1000);
        
        log.info("User registered successfully: {}", user.getUsername());
        
        return new AuthResponse(
            token,
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getRole(),
            expiresAt
        );
    }

    public AuthResponse refreshToken(String username) {
        User user = userService.getUserByUsername(username);
        String token = jwtUtil.generateToken(user);
        LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(jwtUtil.getExpirationTime() / 1000);
        
        return new AuthResponse(
            token,
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getRole(),
            expiresAt
        );
    }
}
