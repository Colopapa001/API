# Ecommerce Backend API

Backend API para aplicación de ecommerce desarrollada con Spring Boot, Spring Security, JWT y MySQL/SQL Server.

## Características

- **Autenticación JWT**: Sistema de autenticación seguro con tokens JWT
- **Spring Security**: Configuración de seguridad con roles y permisos
- **Base de datos**: Soporte para MySQL y SQL Server
- **API REST**: Endpoints completos para todas las funcionalidades
- **Validación**: Validación de datos con Bean Validation
- **CORS**: Configuración CORS para comunicación con frontend
- **Logging**: Sistema de logging configurado
- **Documentación**: Endpoints documentados

## Tecnologías

- Java 17
- Spring Boot 3.2.0
- Spring Security 6
- Spring Data JPA
- MySQL 8.0 / SQL Server
- JWT (JSON Web Tokens)
- Maven
- Lombok

## Estructura del Proyecto

```
src/main/java/com/ecommerce/
├── controller/          # Controladores REST
├── dto/                # Data Transfer Objects
├── model/              # Entidades JPA
├── repository/         # Repositorios JPA
├── security/           # Configuración de seguridad
└── service/            # Lógica de negocio
```

## Configuración

### Base de Datos

#### MySQL
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ecommerce_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: root
    password: password
    driver-class-name: com.mysql.cj.jdbc.Driver
```

#### SQL Server
```yaml
spring:
  datasource:
    url: jdbc:sqlserver://localhost:1433;databaseName=ecommerce_db;encrypt=false;trustServerCertificate=true
    username: sa
    password: YourStrong@Passw0rd
    driver-class-name: com.microsoft.sqlserver.jdbc.SQLServerDriver
```

### Variables de Entorno

Para producción, configura las siguientes variables de entorno:

```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ecommerce_db
DB_USERNAME=root
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400000
FRONTEND_URL=http://localhost:3000
```

## Instalación y Ejecución

### Prerrequisitos

- Java 17 o superior
- Maven 3.6 o superior
- MySQL 8.0 o SQL Server
- IDE (IntelliJ IDEA, Eclipse, VS Code)

### Pasos

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd ecommerce-backend
```

2. **Configurar la base de datos**
   - Crear la base de datos `ecommerce_db`
   - Configurar las credenciales en `application.yml`

3. **Instalar dependencias**
```bash
mvn clean install
```

4. **Ejecutar la aplicación**
```bash
mvn spring-boot:run
```

O ejecutar desde el IDE la clase `EcommerceBackendApplication`

La aplicación estará disponible en: `http://localhost:8080/api`

## Endpoints de la API

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrarse
- `POST /auth/refresh` - Renovar token
- `POST /auth/logout` - Cerrar sesión
- `GET /auth/me` - Obtener usuario actual

### Usuarios
- `GET /users` - Obtener todos los usuarios (ADMIN)
- `GET /users/{id}` - Obtener usuario por ID
- `GET /users/profile` - Obtener perfil actual
- `PUT /users/profile` - Actualizar perfil actual
- `PUT /users/{id}` - Actualizar usuario (ADMIN)
- `PATCH /users/{id}/role` - Cambiar rol (ADMIN)
- `PATCH /users/{id}/status` - Cambiar estado (ADMIN)
- `POST /users/change-password` - Cambiar contraseña
- `DELETE /users/{id}` - Eliminar usuario (ADMIN)

### Categorías
- `GET /categories` - Obtener todas las categorías
- `GET /categories/{id}` - Obtener categoría por ID
- `GET /categories/name/{name}` - Obtener categoría por nombre
- `GET /categories/search` - Buscar categorías
- `POST /categories` - Crear categoría (ADMIN)
- `PUT /categories/{id}` - Actualizar categoría (ADMIN)
- `DELETE /categories/{id}` - Eliminar categoría (ADMIN)

### Productos
- `GET /products` - Obtener productos con filtros
- `GET /products/{id}` - Obtener producto por ID
- `GET /products/category/{categoryId}` - Obtener productos por categoría
- `GET /products/user/{userId}` - Obtener productos por usuario
- `GET /products/my-products` - Obtener mis productos
- `GET /products/in-stock` - Obtener productos en stock
- `GET /products/low-stock` - Obtener productos con stock bajo (SELLER/ADMIN)
- `GET /products/out-of-stock` - Obtener productos sin stock (SELLER/ADMIN)
- `POST /products` - Crear producto
- `PUT /products/{id}` - Actualizar producto
- `PATCH /products/{id}/stock` - Actualizar stock
- `DELETE /products/{id}` - Eliminar producto

### Órdenes
- `GET /orders` - Obtener todas las órdenes (ADMIN)
- `GET /orders/{id}` - Obtener orden por ID
- `GET /orders/order-number/{orderNumber}` - Obtener orden por número
- `GET /orders/my-orders` - Obtener mis órdenes
- `GET /orders/user/{userId}` - Obtener órdenes por usuario (ADMIN)
- `GET /orders/status/{status}` - Obtener órdenes por estado (SELLER/ADMIN)
- `POST /orders` - Crear orden
- `PATCH /orders/{id}/status` - Actualizar estado de orden (SELLER/ADMIN)
- `PATCH /orders/{id}/cancel` - Cancelar orden
- `DELETE /orders/{id}` - Eliminar orden (ADMIN)
- `GET /orders/stats/count` - Estadísticas de órdenes (ADMIN)

## Roles y Permisos

### USER
- Gestionar su perfil
- Crear y gestionar sus productos
- Crear y ver sus órdenes
- Cancelar sus órdenes

### SELLER
- Todas las funcionalidades de USER
- Ver productos con stock bajo
- Ver productos sin stock
- Actualizar estado de órdenes

### ADMIN
- Todas las funcionalidades
- Gestionar usuarios
- Gestionar categorías
- Ver todas las órdenes
- Estadísticas del sistema

## Seguridad

### JWT (JSON Web Tokens)
- Tokens con expiración configurable
- Refresh token para renovar sesiones
- Validación automática en cada request

### Spring Security
- Configuración de roles y permisos
- Protección CSRF deshabilitada para APIs
- CORS configurado para frontend
- Filtros de autenticación personalizados

### Protección de Contraseñas
- Encriptación con BCrypt
- Validación de contraseñas
- Bloqueo de cuentas por intentos fallidos

## Base de Datos

### Entidades Principales
- **User**: Usuarios del sistema
- **Category**: Categorías de productos
- **Product**: Productos
- **Order**: Órdenes de compra
- **OrderItem**: Items de las órdenes

### Relaciones
- User 1:N Product
- Category 1:N Product
- User 1:N Order
- Order 1:N OrderItem
- Product 1:N OrderItem

## Desarrollo

### Perfiles
- `dev`: Desarrollo con base de datos H2 en memoria
- `prod`: Producción con MySQL/SQL Server

### Logging
- Configuración por niveles
- Logs de seguridad
- Logs de base de datos (solo en desarrollo)

### Testing
```bash
mvn test
```

## Despliegue

### Docker
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/ecommerce-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Variables de Entorno para Producción
```bash
SPRING_PROFILES_ACTIVE=prod
DB_HOST=your-db-host
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password
JWT_SECRET=your-secure-jwt-secret
FRONTEND_URL=https://your-frontend-url.com
```

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## Contacto

Tu Nombre - [@tu_twitter](https://twitter.com/tu_twitter) - email@ejemplo.com

Link del Proyecto: [https://github.com/tu_usuario/ecommerce-backend](https://github.com/tu_usuario/ecommerce-backend)
