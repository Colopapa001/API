package com.ecommerce.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Configuración de seguridad para la aplicación E-commerce
 * 
 * Esta configuración implementa:
 * - Autenticación JWT sin estado (stateless)
 * - Protección CSRF deshabilitada para APIs REST
 * - Configuración CORS para el frontend
 * - Autorización basada en roles (USER, SELLER, ADMIN)
 * - Endpoints públicos y protegidos
 */

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CSRF deshabilitado para APIs REST con JWT
            // En APIs REST con JWT, CSRF no es necesario porque:
            // 1. Los tokens JWT se envían en headers Authorization
            // 2. No hay cookies de sesión que puedan ser explotadas
            // 3. El frontend maneja los tokens de forma explícita
            .csrf(AbstractHttpConfigurer::disable)
            
            // Configuración CORS para permitir requests del frontend
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Configuración de sesión sin estado (stateless) para JWT
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Configuración de autorización por roles
            .authorizeHttpRequests(authz -> authz
                // Endpoints públicos - no requieren autenticación
                .requestMatchers("/auth/register", "/auth/login").permitAll()
                .requestMatchers("/categories/**").permitAll()
                .requestMatchers("/products/**").permitAll() // GET permitido para todos
                .requestMatchers("/health/**").permitAll()
                .requestMatchers("/actuator/**").permitAll()
                .requestMatchers("/test/**").permitAll() // Test endpoints for debugging
                
                // Endpoints de administración - solo ADMIN
                .requestMatchers("/admin/**").hasRole("ADMIN")
                
                // Endpoints de vendedor - SELLER y ADMIN
                .requestMatchers("/seller/**").hasAnyRole("SELLER", "ADMIN")
                
                // Endpoints de usuario - todos los roles autenticados
                .requestMatchers("/users/**").hasAnyRole("USER", "SELLER", "ADMIN")
                .requestMatchers("/orders/**").hasAnyRole("USER", "SELLER", "ADMIN")
                .requestMatchers("/cart/**").hasAnyRole("USER", "SELLER", "ADMIN")
                
                // Endpoints de autenticación protegidos
                .requestMatchers("/auth/refresh", "/auth/logout", "/auth/me").authenticated()
                
                // Todas las demás requests requieren autenticación
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        authProvider.setHideUserNotFoundExceptions(false);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}
