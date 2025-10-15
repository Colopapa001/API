# Ecommerce Backend con MySQL

## 🚀 Configuración de Base de Datos MySQL

Este proyecto ahora está configurado para usar MySQL como base de datos principal, proporcionando una API REST robusta y profesional.

## 📋 Prerrequisitos

### 1. XAMPP (Recomendado)
- Descargar e instalar [XAMPP](https://www.apachefriends.org/download.html)
- Iniciar el servicio MySQL desde XAMPP Control Panel

### 2. Java 17+
- Java JDK 17 o superior instalado
- JAVA_HOME configurado correctamente

### 3. Maven
- Maven 3.6+ instalado (o usar el Maven wrapper incluido)

## 🛠️ Configuración de la Base de Datos

### Paso 1: Iniciar MySQL
1. Abrir XAMPP Control Panel
2. Iniciar el servicio MySQL
3. Verificar que MySQL esté corriendo en el puerto 3306

### Paso 2: Configuración de la Base de Datos
La aplicación creará automáticamente:
- **Base de datos**: `ecommerce_db`
- **Usuario**: `root`
- **Contraseña**: (vacía)
- **Puerto**: 3306

## 🚀 Iniciar la Aplicación

### Opción 1: Sistema Completo (Recomendado)
```cmd
start-full-system.bat
```
Este script:
- Verifica que MySQL esté corriendo
- Inicia el backend con MySQL
- Inicia el frontend
- Proporciona información de acceso

### Opción 2: Solo Backend
```cmd
start-backend-mysql.bat
```

### Opción 3: Verificar Conexión
```cmd
test-mysql-connection.bat
```

## 📊 Estructura de la Base de Datos

### Tablas Principales
- **users**: Usuarios del sistema (ADMIN, SELLER, USER)
- **categories**: Categorías de productos
- **products**: Productos del catálogo
- **orders**: Órdenes de compra
- **order_items**: Items de cada orden
- **product_images**: Imágenes de productos

### Usuarios de Prueba
Los siguientes usuarios se crean automáticamente:

| Email | Username | Password | Role |
|-------|----------|----------|------|
| admin@ecommerce.com | admin | password123 | ADMIN |
| seller1@ecommerce.com | seller1 | password123 | SELLER |
| user1@ecommerce.com | user1 | password123 | USER |

## 🔗 Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Cerrar sesión

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/{id}` - Obtener producto
- `POST /api/products` - Crear producto (SELLER/ADMIN)
- `PUT /api/products/{id}` - Actualizar producto (SELLER/ADMIN)
- `DELETE /api/products/{id}` - Eliminar producto (SELLER/ADMIN)

### Categorías
- `GET /api/categories` - Listar categorías
- `GET /api/categories/{id}` - Obtener categoría

### Usuarios
- `GET /api/users` - Listar usuarios (ADMIN)
- `GET /api/users/{id}` - Obtener usuario
- `PUT /api/users/{id}` - Actualizar usuario

### Órdenes
- `GET /api/orders` - Listar órdenes
- `POST /api/orders` - Crear orden
- `GET /api/orders/{id}` - Obtener orden

## 🧪 Probar la API

### 1. Verificar que el backend esté corriendo
```cmd
curl http://localhost:8081/api/categories
```

### 2. Probar login
```cmd
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin@ecommerce.com","password":"password123"}'
```

### 3. Probar registro
```cmd
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"123456","firstName":"Test","lastName":"User"}'
```

## 🔧 Configuración Avanzada

### Cambiar Configuración de Base de Datos
Editar `src/main/resources/application-dev.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ecommerce_db
    username: tu_usuario
    password: tu_contraseña
```

### Cambiar Puerto del Backend
Editar `application-dev.yml`:

```yaml
server:
  port: 8081  # Cambiar por el puerto deseado
```

## 🐛 Solución de Problemas

### Error: "MySQL is not running"
- Verificar que XAMPP esté iniciado
- Iniciar el servicio MySQL desde XAMPP Control Panel
- Verificar que el puerto 3306 esté libre

### Error: "Connection refused"
- Verificar que MySQL esté corriendo
- Verificar credenciales de base de datos
- Verificar que la base de datos `ecommerce_db` exista

### Error: "JAVA_HOME not defined"
- Configurar JAVA_HOME: `set JAVA_HOME=C:\Program Files\Java\jdk-24`
- Verificar que Java esté instalado correctamente

## 📱 Frontend

El frontend se conecta automáticamente al backend en:
- **Backend**: http://localhost:8081/api
- **Frontend**: http://localhost:3000

## 🎯 Próximos Pasos

1. **Iniciar el sistema**: `start-full-system.bat`
2. **Probar login** con usuarios de prueba
3. **Crear productos** como seller
4. **Realizar compras** como usuario
5. **Administrar sistema** como admin

¡El sistema está listo para usar con una base de datos MySQL profesional!
