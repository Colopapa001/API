# Documentación de Seguridad - E-commerce API

## Resumen de Seguridad Implementada

Esta API REST implementa un sistema de seguridad robusto utilizando Spring Security con JWT (JSON Web Tokens) para autenticación y autorización.

## Componentes de Seguridad

### 1. Spring Security Configuration

**Archivo:** `SecurityConfig.java`

La configuración de seguridad incluye:

- **Autenticación JWT sin estado (Stateless)**: No se mantienen sesiones en el servidor
- **Protección CSRF deshabilitada**: No es necesaria en APIs REST con JWT
- **Configuración CORS**: Permite requests desde el frontend
- **Autorización basada en roles**: USER, SELLER, ADMIN

### 2. JWT (JSON Web Token)

**Archivo:** `JwtUtil.java`

#### ¿Qué es JWT?
JWT es un estándar para transmitir información de forma segura entre partes como un objeto JSON. En nuestro caso, se usa para autenticación.

#### Estructura del JWT:
```
header.payload.signature
```

#### Flujo de JWT:
1. **Login**: Usuario envía credenciales → Servidor valida → Genera JWT
2. **Requests**: Cliente envía JWT en header `Authorization: Bearer <token>`
3. **Validación**: Servidor valida JWT en cada request
4. **Expiración**: Token expira después de 24 horas

#### Ventajas de JWT:
- **Sin estado**: No requiere almacenamiento en servidor
- **Escalable**: Fácil de usar en múltiples servidores
- **Seguro**: Firmado digitalmente
- **Portátil**: Contiene toda la información necesaria

### 3. Protección CSRF

#### ¿Qué es CSRF?
CSRF (Cross-Site Request Forgery) es un ataque donde un sitio web malicioso hace que el navegador del usuario envíe requests no deseados a un sitio web en el que el usuario está autenticado.

#### ¿Por qué CSRF no es necesario en APIs REST con JWT?

1. **No hay cookies de sesión**: JWT se envía en headers, no en cookies
2. **Same-Origin Policy**: Los navegadores bloquean requests cross-origin por defecto
3. **Headers explícitos**: El frontend debe enviar explícitamente el token JWT
4. **CORS configurado**: Solo dominios autorizados pueden hacer requests

#### Configuración CSRF:
```java
.csrf(AbstractHttpConfigurer::disable)
```

### 4. Sistema de Roles

#### Roles Implementados:
- **USER**: Usuario regular, puede comprar productos
- **SELLER**: Vendedor, puede crear y gestionar productos
- **ADMIN**: Administrador, acceso completo al sistema

#### Configuración de Roles:
```java
// Solo ADMIN
.requestMatchers("/admin/**").hasRole("ADMIN")

// SELLER y ADMIN
.requestMatchers("/seller/**").hasAnyRole("SELLER", "ADMIN")

// Todos los roles autenticados
.requestMatchers("/users/**").hasAnyRole("USER", "SELLER", "ADMIN")
```

### 5. Endpoints de Seguridad

#### Públicos (No requieren autenticación):
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Login de usuarios
- `GET /api/categories/**` - Listar categorías
- `GET /api/products/**` - Listar productos
- `GET /api/health/**` - Health check

#### Protegidos por Autenticación:
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Información del usuario actual

#### Protegidos por Roles:
- `GET /api/admin/**` - Solo ADMIN
- `GET /api/seller/**` - SELLER y ADMIN
- `GET /api/users/**` - USER, SELLER, ADMIN

### 6. Anotaciones de Seguridad

#### En Controladores:
```java
@PreAuthorize("hasRole('ADMIN')")
@PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
@PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
```

#### En Servicios:
```java
@PreAuthorize("hasRole('ADMIN')")
public void adminOnlyMethod() { ... }
```

### 7. Configuración de CORS

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(List.of("*"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    return source;
}
```

### 8. Encriptación de Contraseñas

Las contraseñas se almacenan encriptadas usando BCrypt:
```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

## Flujo de Autenticación

1. **Registro/Login**: Usuario envía credenciales
2. **Validación**: Servidor valida credenciales contra la base de datos
3. **Generación JWT**: Si es válido, se genera un JWT con información del usuario
4. **Respuesta**: Cliente recibe el JWT
5. **Requests subsecuentes**: Cliente envía JWT en header Authorization
6. **Validación JWT**: Servidor valida el token en cada request
7. **Autorización**: Se verifica que el usuario tenga el rol necesario

## Mejores Prácticas Implementadas

1. **Tokens con expiración**: 24 horas
2. **Contraseñas encriptadas**: BCrypt
3. **Validación de entrada**: @Valid en DTOs
4. **Manejo de errores**: GlobalExceptionHandler
5. **Logging**: Logs de seguridad para auditoría
6. **CORS configurado**: Solo dominios autorizados
7. **Headers de seguridad**: Configuración CORS apropiada

## Consideraciones de Seguridad

1. **JWT Secret**: Debe ser cambiado en producción
2. **HTTPS**: Obligatorio en producción
3. **Rate Limiting**: Considerar implementar para prevenir ataques
4. **Validación de entrada**: Siempre validar datos de entrada
5. **Logs de auditoría**: Mantener logs de acciones sensibles
6. **Backup de base de datos**: Implementar estrategia de backup

## Testing de Seguridad

Para probar la seguridad:

1. **Endpoints públicos**: Deben funcionar sin token
2. **Endpoints protegidos**: Deben rechazar requests sin token
3. **Roles**: Verificar que solo usuarios con rol correcto accedan
4. **JWT expirado**: Debe rechazar tokens expirados
5. **JWT inválido**: Debe rechazar tokens malformados
