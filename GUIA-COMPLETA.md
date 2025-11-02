# 🛒 Guía Completa del Sistema Ecommerce

## 📋 Tabla de Contenidos
1. [Requisitos Previos](#requisitos-previos)
2. [Inicio Rápido](#inicio-rápido)
3. [Usuarios de Prueba](#usuarios-de-prueba)
4. [Funcionalidades](#funcionalidades)
5. [Endpoints Disponibles](#endpoints-disponibles)

---

## 🔧 Requisitos Previos

### Software Necesario
1. **Java 17 (requerido)** — Eclipse Adoptium Temurin recomendado
   - El backend está compilado para Java 17 (ver `pom.xml` -> `<java.version>17`). Usa un JDK 17 para ejecutar Maven/Spring Boot.
   - Ruta sugerida (si está instalada en tu máquina): `C:\Program Files\Java\jdk-17`
   - Si tienes varios JDKs instalados (por ejemplo Adoptium jdk-25), usa JDK 17 para este proyecto: versiones mayores pueden introducir incompatibilidades con dependencias o con la configuración del proyecto.
   
2. **Node.js** (v16 o superior)
   - Descarga: https://nodejs.org/
   
3. **MySQL** (puerto 3306)
   - XAMPP o instalación independiente
   - Base de datos: `ecommerce_db`
   - Usuario: `root` (sin contraseña)

4. **Maven** (incluido en el proyecto)

---

## 🚀 Inicio Rápido

### Opción 1: Iniciar Todo Automáticamente (Recomendado)
```batch
.\start-full-system.bat
```

Este script:
- ✅ Inicia el backend en puerto 8080
- ✅ Espera 30 segundos para que el backend esté listo
- ✅ Inicia el frontend en puerto 3000
- ✅ Abre ambas aplicaciones en ventanas separadas

### Opción 2: Iniciar Manualmente

#### 1. Iniciar Backend
```batch
.\start-backend.bat
```
Espera hasta que veas: `Started EcommerceBackendApplication`

#### 2. Iniciar Frontend
```bash
cd ecommerce-frontend
npm start
```
Se abrirá automáticamente en: http://localhost:3000

---

## 👥 Usuarios de Prueba

### Usuario Administrador
- **Email/Username:** `admin`
- **Password:** `Password123`
- **Rol:** ADMIN
- **Permisos:** Acceso completo al sistema

### Usuario Vendedor
- **Email/Username:** `seller1`
- **Password:** `Password123`
- **Rol:** SELLER
- **Permisos:** Crear/editar productos, ver órdenes

### Usuario Regular
- **Email/Username:** `user1`
- **Password:** `Password123`
- **Rol:** USER
- **Permisos:** Comprar productos, ver sus órdenes

---

## 🎯 Funcionalidades

### Para Usuarios (USER)
- ✅ Ver catálogo de productos
- ✅ Buscar productos por categoría
- ✅ Agregar productos al carrito
- ✅ Crear órdenes de compra
- ✅ Ver historial de órdenes
- ✅ Gestionar perfil personal

### Para Vendedores (SELLER)
- ✅ Todas las funcionalidades de USER
- ✅ Crear nuevos productos
- ✅ Editar sus productos
- ✅ Ver estadísticas de ventas
- ✅ Gestionar inventario

### Para Administradores (ADMIN)
- ✅ Todas las funcionalidades anteriores
- ✅ Gestionar usuarios del sistema
- ✅ Crear/editar categorías
- ✅ Ver reportes del sistema
- ✅ Gestión completa de productos

---

## 🌐 Endpoints Disponibles

### 🔓 Públicos (Sin autenticación)
```
GET  http://localhost:8080/api/products
GET  http://localhost:8080/api/categories
POST http://localhost:8080/api/auth/register
POST http://localhost:8080/api/auth/login
```

### 🔐 Protegidos (Requieren token JWT)

#### Productos
```
POST   /api/products          - Crear producto (SELLER/ADMIN)
PUT    /api/products/{id}     - Actualizar producto (SELLER/ADMIN)
DELETE /api/products/{id}     - Eliminar producto (SELLER/ADMIN)
```

#### Usuarios
```
GET    /api/users/profile     - Ver mi perfil
PUT    /api/users/profile     - Actualizar mi perfil
POST   /api/users/change-password - Cambiar contraseña
```

#### Órdenes
```
POST   /api/orders            - Crear orden
GET    /api/orders            - Listar mis órdenes
GET    /api/orders/{id}       - Ver detalle de orden
```

---

## 🧪 Probar el Sistema

### 1. Acceder al Frontend
Abre tu navegador en: http://localhost:3000

### 2. Registrar un Nuevo Usuario
- Click en "Registrarse"
- Completa el formulario
- El sistema generará un token JWT automáticamente

### 3. Iniciar Sesión
Usa cualquiera de los usuarios de prueba mencionados arriba

### 4. Explorar Productos
- Ve a "Productos" en el menú
- Verás los 10 productos de prueba
- Puedes filtrar por categoría

### 5. Agregar al Carrito
- Click en un producto para ver detalles
- Agrega cantidad y click en "Agregar al Carrito"

### 6. Crear Orden
- Ve al carrito
- Completa los datos de envío
- Confirma la orden

---

## 🛠️ Solución de Problemas

### Backend no inicia
1. Verifica que Java 17 esté instalado:
   ```batch
   java -version
   ```
2. Verifica que MySQL esté corriendo
3. Verifica que el puerto 8080 no esté en uso

### Frontend no inicia
1. Verifica que Node.js esté instalado:
   ```batch
   node --version
   ```
2. Instala dependencias:
   ```batch
   cd ecommerce-frontend
   npm install
   ```

### Error de conexión
1. Verifica que el backend esté corriendo en http://localhost:8080
2. Verifica la consola del navegador (F12) para errores
3. Verifica que no haya bloqueos de CORS

---

## 📝 Notas Importantes

### Base de Datos
- Los datos se resetean cada vez que reinicias MySQL
- Los productos de prueba se cargan automáticamente
- Los usuarios de prueba se crean al iniciar

### Tokens JWT
- Duración: 24 horas
- Se almacenan en localStorage
- Se envían automáticamente en cada request

### CORS
- Configurado para permitir localhost:3000
- No permite otros orígenes por defecto

---

## 🎉 ¡Listo para Usar!

El sistema está completamente funcional. Puedes:
- ✅ Registrar nuevos usuarios
- ✅ Iniciar sesión
- ✅ Ver productos
- ✅ Crear órdenes
- ✅ Gestionar productos (si eres SELLER/ADMIN)

---

**¿Necesitas ayuda?** Revisa los logs en las ventanas de terminal de backend y frontend.
