# E-commerce API - Sistema Completo

Este proyecto implementa un sistema de e-commerce completo con backend Spring Boot y frontend React, utilizando autenticación JWT y base de datos MySQL.

## 🏗️ Arquitectura del Sistema

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.3.5
- **Base de datos**: MySQL (XAMPP)
- **Seguridad**: Spring Security + JWT
- **Puerto**: 8081

### Frontend (React)
- **Framework**: React 18.2.0
- **Routing**: React Router DOM
- **Estado**: Context API
- **Puerto**: 3000

## 🚀 Características Implementadas

### Seguridad
- ✅ **Autenticación JWT** sin estado (stateless)
- ✅ **Protección CSRF** deshabilitada para APIs REST
- ✅ **Sistema de roles**: USER, SELLER, ADMIN
- ✅ **Encriptación de contraseñas** con BCrypt
- ✅ **Configuración CORS** para el frontend

### Funcionalidades
- ✅ **Registro y login** de usuarios
- ✅ **Gestión de productos** (CRUD)
- ✅ **Gestión de categorías**
- ✅ **Sistema de órdenes**
- ✅ **Panel de administración**
- ✅ **Panel de vendedor**
- ✅ **Carrito de compras**

## 📋 Requisitos Previos

1. **Java 17** o superior
2. **Node.js 16** o superior
3. **XAMPP** con MySQL
4. **Maven 3.6** o superior

## 🛠️ Instalación y Configuración

### 1. Configurar Base de Datos

1. Iniciar XAMPP y activar MySQL
2. Crear la base de datos:
```sql
CREATE DATABASE ecommerce_db;
```

### 2. Configurar Backend

```bash
cd ecommerce-backend
mvn clean install
```

### 3. Configurar Frontend

```bash
cd ecommerce-frontend
npm install
```

## 🚀 Ejecución del Sistema

### Opción 1: Script Automático
```bash
# Ejecutar el script de inicio completo
start-system.bat
```

### Opción 2: Manual

#### Backend
```bash
cd ecommerce-backend
mvn spring-boot:run
```

#### Frontend
```bash
cd ecommerce-frontend
npm start
```

## 📡 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/refresh` - Renovar token
- `GET /api/auth/me` - Información del usuario actual

### Productos
- `GET /api/products` - Listar productos (público)
- `GET /api/products/{id}` - Obtener producto por ID
- `POST /api/products` - Crear producto (SELLER/ADMIN)
- `PUT /api/products/{id}` - Actualizar producto (SELLER/ADMIN)
- `DELETE /api/products/{id}` - Eliminar producto (SELLER/ADMIN)

### Administración
- `GET /api/admin/users` - Listar usuarios (ADMIN)
- `PUT /api/admin/users/{id}/role` - Cambiar rol de usuario (ADMIN)
- `GET /api/admin/stats` - Estadísticas del sistema (ADMIN)

### Vendedor
- `GET /api/seller/products` - Mis productos (SELLER/ADMIN)
- `GET /api/seller/orders` - Mis órdenes (SELLER/ADMIN)
- `GET /api/seller/stats` - Estadísticas del vendedor (SELLER/ADMIN)

## 🔐 Sistema de Roles

### USER
- Ver productos y categorías
- Realizar compras
- Gestionar perfil

### SELLER
- Todas las funciones de USER
- Crear y gestionar productos
- Ver órdenes de sus productos
- Estadísticas de ventas

### ADMIN
- Todas las funciones de USER y SELLER
- Gestionar usuarios
- Cambiar roles
- Estadísticas del sistema

## 🛡️ Seguridad Implementada

### JWT (JSON Web Token)
- **Duración**: 24 horas
- **Almacenamiento**: localStorage del navegador
- **Envío**: Header `Authorization: Bearer <token>`

### Protección CSRF
- **Deshabilitada** para APIs REST con JWT
- **Razón**: No es necesaria cuando se usan tokens en headers

### CORS
- **Orígenes permitidos**: `http://localhost:3000`
- **Métodos**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Todos permitidos

## 📁 Estructura del Proyecto

```
API/
├── ecommerce-backend/          # Backend Spring Boot
│   ├── src/main/java/com/ecommerce/
│   │   ├── config/            # Configuraciones
│   │   ├── controller/        # Controladores REST
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── model/            # Entidades JPA
│   │   ├── repository/       # Repositorios JPA
│   │   ├── security/         # Configuración de seguridad
│   │   └── service/          # Lógica de negocio
│   └── src/main/resources/
│       ├── application.yml   # Configuración principal
│       ├── schema.sql        # Esquema de base de datos
│       └── data.sql          # Datos iniciales
├── ecommerce-frontend/        # Frontend React
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── context/          # Context API
│   │   ├── pages/           # Páginas
│   │   ├── services/        # Servicios API
│   │   └── styles/          # Estilos CSS
│   └── package.json
└── README.md
```

## 🧪 Testing

### Probar Autenticación
```bash
# Registro
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"test@example.com","password":"password123"}'
```

### Probar Productos
```bash
# Listar productos (público)
curl http://localhost:8081/api/products

# Crear producto (requiere autenticación)
curl -X POST http://localhost:8081/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"Producto Test","description":"Descripción","price":99.99,"stock":10,"categoryId":1}'
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno
El backend usa las siguientes configuraciones en `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ecommerce_db
    username: root
    password: # (vacío para XAMPP por defecto)
  security:
    jwt:
      secret: mySecretKey123456789012345678901234567890
      expiration: 86400000 # 24 horas
```

### Base de Datos
- **Host**: localhost:3306
- **Base de datos**: ecommerce_db
- **Usuario**: root
- **Contraseña**: (vacía por defecto en XAMPP)

## 📚 Documentación Adicional

- [Documentación de Seguridad](ecommerce-backend/SECURITY_DOCUMENTATION.md)
- [Instrucciones del Backend](INSTRUCCIONES_BACKEND.md)
- [Configuración MySQL](README-MYSQL.md)

## 🐛 Solución de Problemas

### Error de Conexión a Base de Datos
1. Verificar que XAMPP esté ejecutándose
2. Verificar que MySQL esté activo
3. Verificar que la base de datos `ecommerce_db` exista

### Error de CORS
1. Verificar que el frontend esté en `http://localhost:3000`
2. Verificar la configuración CORS en `SecurityConfig.java`

### Error de Autenticación
1. Verificar que el token JWT sea válido
2. Verificar que el token no haya expirado
3. Verificar que el header `Authorization` esté presente

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [TuGitHub](https://github.com/tuusuario)

## 🙏 Agradecimientos

- Spring Boot Team
- React Team
- MySQL Community
- XAMPP Team
