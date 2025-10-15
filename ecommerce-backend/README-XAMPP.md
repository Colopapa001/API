# Configuración con XAMPP

## Requisitos previos

1. **XAMPP** instalado y ejecutándose
2. **Apache** y **MySQL** iniciados
3. **Java 17+** instalado
4. **Maven** instalado

## Pasos para configurar

### 1. Iniciar XAMPP
- Abrir XAMPP Control Panel
- Iniciar **Apache** y **MySQL**
- Verificar que ambos servicios estén ejecutándose (puerto 80 para Apache, puerto 3306 para MySQL)

### 2. Configurar la base de datos
- Abrir **phpMyAdmin** (http://localhost/phpmyadmin)
- Ejecutar el script `setup-xampp.sql` para crear la base de datos
- O crear manualmente la base de datos `ecommerce_db`

### 3. Configurar la aplicación
- La aplicación está configurada para conectarse a:
  - **Host**: localhost
  - **Puerto**: 3306
  - **Base de datos**: ecommerce_db
  - **Usuario**: root
  - **Contraseña**: (vacía por defecto en XAMPP)

### 4. Ejecutar la aplicación
```bash
# Con perfil de desarrollo
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# O simplemente
mvn spring-boot:run
```

### 5. Verificar la aplicación
- **API**: http://localhost:8080/api
- **Endpoints principales**:
  - POST /api/auth/register
  - POST /api/auth/login
  - GET /api/products
  - GET /api/categories

## Estructura de la base de datos

La aplicación creará automáticamente las siguientes tablas:
- `users` - Usuarios del sistema
- `categories` - Categorías de productos
- `products` - Productos
- `orders` - Órdenes
- `order_items` - Items de las órdenes

## Datos de prueba

Se insertarán automáticamente:
- 3 usuarios (admin, seller1, user1)
- 5 categorías
- 10 productos de ejemplo

**Credenciales de prueba**:
- Usuario: admin / Contraseña: password
- Usuario: seller1 / Contraseña: password
- Usuario: user1 / Contraseña: password

## Solución de problemas

### Error de conexión a MySQL
- Verificar que MySQL esté ejecutándose en XAMPP
- Verificar que el puerto 3306 esté disponible
- Verificar las credenciales en `application.yml`

### Error de base de datos no encontrada
- Crear manualmente la base de datos `ecommerce_db` en phpMyAdmin
- Ejecutar el script `setup-xampp.sql`

### Error de permisos
- Verificar que el usuario `root` tenga permisos en MySQL
- En XAMPP, el usuario root normalmente no tiene contraseña
