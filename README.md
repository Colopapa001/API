# 🛒 Sistema E-commerce Completo
## Proyecto de Trabajo Práctico

Sistema completo de e-commerce desarrollado con arquitectura de microservicios, incluyendo backend Spring Boot con autenticación JWT y frontend React con Context API.

---

## 📚 Índice

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Requisitos del Proyecto](#requisitos-del-proyecto)
5. [Características Implementadas](#características-implementadas)
6. [Instalación y Configuración](#instalación-y-configuración)
7. [Ejecución del Sistema](#ejecución-del-sistema)
8. [Estructura del Código](#estructura-del-código)
9. [Documentación de APIs](#documentación-de-apis)
10. [Sistema de Seguridad](#sistema-de-seguridad)
11. [Casos de Uso y Flujos](#casos-de-uso-y-flujos)
12. [Testing y Validación](#testing-y-validación)

---

## 📖 Descripción del Proyecto

Este proyecto implementa un sistema completo de e-commerce que permite a usuarios comprar productos, a vendedores gestionar su inventario y a administradores gestionar el sistema completo. El sistema está diseñado con una arquitectura en capas que separa las responsabilidades del código y facilita el mantenimiento y escalabilidad.

### Objetivos Cumplidos
- ✅ Backend REST API con Spring Boot y Spring Data JPA
- ✅ Frontend React con arquitectura moderna
- ✅ Autenticación y autorización basada en JWT
- ✅ Sistema de roles y permisos (USER, SELLER, ADMIN)
- ✅ Gestión completa de productos, categorías y órdenes
- ✅ Carrito de compras y sistema de pedidos
- ✅ Integración con base de datos MySQL
- ✅ Arquitectura en capas (Presentation, Business, Data Access, Domain)

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Java 17** - Lenguaje de programación
- **Spring Boot 3.3.5** - Framework principal
- **Spring Data JPA** - Persistencia de datos
- **Spring Security** - Seguridad y autenticación
- **JWT (JSON Web Tokens)** - Autenticación stateless
- **MySQL 8.0** - Base de datos relacional
- **Hibernate** - ORM (Object-Relational Mapping)
- **Maven** - Gestión de dependencias y build
- **Lombok** - Reducción de boilerplate code
- **Bean Validation** - Validación de datos

### Frontend
- **React 18.2.0** - Framework de interfaz
- **React Router DOM 6.3.0** - Enrutamiento
- **Context API** - Gestión de estado global
- **CSS3** - Estilos y diseño responsive
- **Fetch API** - Comunicación con backend

### Base de Datos
- **MySQL 8.0** - Sistema gestor de base de datos
- **XAMPP** - Entorno de desarrollo local

### Desarrollo
- **Java JDK 17** - Entorno de ejecución
- **Node.js 16+** - Runtime de JavaScript
- **npm** - Gestor de paquetes de Node.js

---

## 🏗️ Arquitectura del Sistema

### Backend (Spring Boot)
```
ecommerce-backend/
├── src/main/java/com/ecommerce/
│   ├── controller/          # Capa de Presentación (REST Controllers)
│   ├── service/             # Capa de Lógica de Negocio
│   ├── repository/          # Capa de Acceso a Datos
│   ├── model/               # Capa de Dominio (Entidades JPA)
│   ├── dto/                 # Data Transfer Objects
│   ├── security/            # Configuración de Seguridad
│   └── config/              # Configuraciones del sistema
└── src/main/resources/
    ├── application.yml      # Configuración principal
    ├── schema.sql           # Esquema de base de datos
    └── data.sql             # Datos iniciales
```

### Frontend (React)
```
ecommerce-frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   ├── pages/               # Páginas de la aplicación
│   ├── context/             # Context API para estado global
│   ├── services/            # Servicios de API
│   ├── utils/               # Utilidades y helpers
│   └── styles/              # Estilos globales
└── public/                  # Archivos estáticos
```

### Arquitectura en Capas (Backend)

#### 1. Capa de Presentación (Controllers)
- **Responsabilidad**: Manejar requests HTTP y respuestas
- **Tecnología**: `@RestController`, `@RequestMapping`
- **Ejemplo**: `ProductController.java`, `AuthController.java`, `UserController.java`

#### 2. Capa de Lógica de Negocio (Services)
- **Responsabilidad**: Implementar reglas de negocio
- **Tecnología**: `@Service`, transacciones, validaciones
- **Ejemplo**: `ProductService.java`, `UserService.java`, `OrderService.java`

#### 3. Capa de Acceso a Datos (Repositories)
- **Responsabilidad**: Interacción con base de datos
- **Tecnología**: `JpaRepository`, queries personalizadas
- **Ejemplo**: `ProductRepository.java`, `UserRepository.java`

#### 4. Capa de Dominio (Models)
- **Responsabilidad**: Representar entidades del negocio
- **Tecnología**: `@Entity`, `@Table`, anotaciones JPA
- **Ejemplo**: `User.java`, `Product.java`, `Order.java`

---

## 📋 Requisitos del Proyecto

### Requisitos Funcionales
- ✅ Registro e inicio de sesión de usuarios
- ✅ Gestión de productos (CRUD) para vendedores
- ✅ Búsqueda y filtrado de productos
- ✅ Carrito de compras
- ✅ Sistema de órdenes/pedidos
- ✅ Gestión de categorías
- ✅ Panel de administración
- ✅ Panel de vendedor con estadísticas

### Requisitos No Funcionales
- ✅ Autenticación segura con JWT
- ✅ Validación de datos en todas las capas
- ✅ Manejo centralizado de excepciones
- ✅ CORS configurado para frontend
- ✅ Logging y auditoría
- ✅ Escalabilidad y mantenibilidad

### Requisitos de Seguridad
- ✅ Encriptación de contraseñas con BCrypt
- ✅ Autenticación stateless con JWT
- ✅ Autorización basada en roles
- ✅ Protección CSRF deshabilitada (REST con JWT)
- ✅ Validación de entrada para prevenir SQL Injection
- ✅ Bloqueo de cuentas por intentos fallidos

---

## ⚙️ Características Implementadas

### 1. Sistema de Usuarios y Roles
- **USER**: Ver productos, agregar al carrito, crear órdenes
- **SELLER**: Todas las funciones de USER + gestionar productos propios
- **ADMIN**: Acceso completo al sistema

### 2. Gestión de Productos
- Crear, leer, actualizar y eliminar productos
- Categorización de productos
- Control de inventario
- Búsqueda y filtrado
- Imágenes múltiples por producto

### 3. Sistema de Órdenes
- Crear órdenes desde el carrito
- Seguimiento de órdenes
- Gestión de stock automática
- Historial de compras

### 4. Carrito de Comras
- Agregar/eliminar productos
- Actualizar cantidades
- Calcular totales automáticamente
- Persistencia en sessionStorage

### 5. Seguridad y Autenticación
- Registro de usuarios
- Login con JWT
- Refresh tokens
- Protección de endpoints por roles
- Logout seguro

---

## 🚀 Instalación y Configuración

### Prerrequisitos
1. **Java 17** instalado (Eclipse Adoptium)
2. **Node.js 16+** instalado
3. **XAMPP** con MySQL activo
4. **Maven** (incluido en el proyecto)

### Instalación Paso a Paso

#### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd API
```

#### 2. Configurar Base de Datos
1. Iniciar XAMPP
2. Activar MySQL
3. La aplicación creará automáticamente la base de datos `ecommerce_db`

#### 3. Configurar Backend
```bash
cd ecommerce-backend
mvn clean install
```

#### 4. Configurar Frontend
```bash
cd ecommerce-frontend
npm install
```

---

## 🎬 Ejecución del Sistema

### Opción 1: Inicio Automático (Recomendado)
```bash
.\start-full-system.bat
```

Este script:
- Verifica que Java y Node.js estén instalados
- Detiene procesos existentes
- Inicia el backend en http://localhost:8080/api
- Espera 60 segundos para que el backend inicie completamente
- Inicia el frontend en http://localhost:3000
- Abre ambas aplicaciones en ventanas separadas

### Opción 2: Inicio Manual

#### Iniciar Backend
```bash
.\start-backend.bat
```
Espera hasta ver: `Started EcommerceBackendApplication`

#### Iniciar Frontend
```bash
cd ecommerce-frontend
npm start
```

---

## 👥 Usuarios de Prueba

| Usuario | Email | Password | Rol | Descripción |
|---------|-------|----------|-----|-------------|
| admin | admin@ecommerce.com | Password123 | ADMIN | Acceso completo |
| seller1 | seller1@ecommerce.com | Password123 | SELLER | Vendedor |
| user1 | user1@ecommerce.com | Password123 | USER | Usuario regular |
| frontenduser | frontenduser | Password123 | SELLER | Usuario para frontend |

---

## 📁 Estructura del Código

### Backend - Capas de Arquitectura

#### Controller (Capa de Presentación)
```java
// ProductController.java - Maneja requests HTTP
@RestController
@RequestMapping("/products")
public class ProductController {
    // GET, POST, PUT, DELETE endpoints
    // Delegates business logic to Service
}
```

#### Service (Capa de Lógica de Negocio)
```java
// ProductService.java - Contiene reglas de negocio
@Service
public class ProductService {
    // Lógica de negocio
    // Validaciones
    // Transformaciones de datos
    // Calls to Repository
}
```

#### Repository (Capa de Acceso a Datos)
```java
// ProductRepository.java - Interacción con BD
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Queries personalizadas
    // Métodos de Spring Data JPA
}
```

#### Model (Capa de Dominio)
```java
// Product.java - Entidad JPA
@Entity
@Getter @Setter
public class Product {
    // Campos de la entidad
    // Relaciones JPA
    // Validaciones
}
```

### Frontend - Arquitectura React

#### Pages (Páginas Principales)
- `Home.jsx` - Página principal con productos
- `ProductDetail.jsx` - Detalle de producto
- `MyProducts.jsx` - Gestión de productos (SELLER)
- `Cart.jsx` - Carrito de compras
- `Profile.jsx` - Perfil de usuario

#### Context (Estado Global)
- `AuthContext.jsx` - Autenticación y usuario
- `CartContext.jsx` - Carrito de compras
- `ThemeContext.jsx` - Tema oscuro/claro

#### Services (Comunicación API)
- `Api.js` - Funciones de comunicación con backend
- `Auth.js` - Servicios de autenticación

---

## 🔌 Documentación de APIs

### Base URL
```
Backend: http://localhost:8080/api
Frontend: http://localhost:3000
```

### Autenticación

#### POST /api/auth/register
Registro de nuevo usuario.

**Request Body:**
```json
{
  "username": "usuario123",
  "email": "usuario@example.com",
  "password": "Password123",
  "firstName": "Juan",
  "lastName": "Pérez"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "usuario123",
    "email": "usuario@example.com",
    "role": "USER"
  }
}
```

#### POST /api/auth/login
Inicio de sesión.

**Request Body:**
```json
{
  "usernameOrEmail": "admin@ecommerce.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "expiresIn": 86400000
}
```

### Productos

#### GET /api/products/all
Obtener todos los productos (sin paginación).

**Headers:** Ninguno (público)

**Response:**
```json
[
  {
    "id": 1,
    "name": "iPhone 15",
    "description": "Último modelo de iPhone",
    "price": 999.99,
    "stock": 10,
    "category": {
      "id": 1,
      "name": "Electrónicos"
    },
    "categoryId": 1,
    "sellerId": 2,
    "sellerName": "Juan Pérez"
  }
]
```

#### GET /api/products/{id}
Obtener producto por ID.

**Headers:** Ninguno (público)

**Response:**
```json
{
  "id": 1,
  "name": "iPhone 15",
  "description": "Último modelo de iPhone",
  "price": 999.99,
  "stock": 10,
  "category": {
    "id": 1,
    "name": "Electrónicos"
  }
}
```

### Vendedor

#### GET /api/seller/products
Obtener productos del vendedor autenticado.

**Headers:** 
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "name": "Mi Producto",
      "price": 99.99,
      "stock": 10
    }
  ],
  "totalElements": 1
}
```

---

## 🔐 Sistema de Seguridad

### JWT (JSON Web Tokens)

#### Configuración
- **Algoritmo**: HS256
- **Duración**: 24 horas
- **Almacenamiento**: localStorage (frontend)
- **Envío**: Header `Authorization: Bearer <token>`

#### Estructura del Token
```
header.payload.signature

Header: Tipo de token y algoritmo
Payload: Datos del usuario (username, roles, exp)
Signature: Firma verificable
```

#### Flujo de Autenticación
1. Usuario envía credenciales → POST /api/auth/login
2. Servidor valida credenciales
3. Servidor genera JWT con datos del usuario
4. Cliente almacena token en localStorage
5. Cliente envía token en cada request en header `Authorization`
6. Servidor valida token en cada request
7. Servidor procesa request si token es válido

### Seguridad Implementada

#### 1. Encriptación de Contraseñas
```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```
- Algoritmo: BCrypt
- Salt automático
- Cost factor: 10

#### 2. Protección CSRF
- **Deshabilitada** para APIs REST
- **Razón**: No es necesaria con JWT en headers
- No hay cookies de sesión que proteger

#### 3. CORS (Cross-Origin Resource Sharing)
```java
allowed-origins: http://localhost:3000
allowed-methods: GET, POST, PUT, DELETE
allowed-headers: "*"
allow-credentials: true
```

#### 4. Bloqueo de Cuentas
- Máximo 5 intentos fallidos
- Bloqueo por 30 minutos
- Reset automático después del tiempo de bloqueo

---

## 🎯 Casos de Uso y Flujos

### Caso de Uso 1: Usuario Compra un Producto

1. Usuario navega por el catálogo (GET /api/products/all)
2. Usuario selecciona un producto
3. Usuario agrega producto al carrito (almacenado en sessionStorage)
4. Usuario procede al checkout
5. Sistema crea orden (POST /api/orders)
6. Sistema actualiza stock del producto
7. Sistema genera confirmación de orden

### Caso de Uso 2: Vendedor Crea un Producto

1. Vendedor inicia sesión (POST /api/auth/login)
2. Vendedor navega a "Mis Productos"
3. Vendedor hace clic en "Agregar Producto"
4. Vendedor completa formulario
5. Sistema valida datos (Bean Validation)
6. Sistema crea producto (POST /api/products)
7. Producto aparece en catálogo

### Caso de Uso 3: Administrador Gestiona Usuarios

1. Administrador inicia sesión
2. Administrador navega a panel de administración
3. Administrador ve lista de usuarios (GET /api/users)
4. Administrador cambia rol de usuario (PUT /api/users/{id}/role)
5. Sistema actualiza permisos del usuario

---

## 🧪 Testing y Validación

### Probar el Sistema

#### 1. Acceder al Frontend
```
URL: http://localhost:3000
```

#### 2. Registrar Usuario
- Click en "Registrarse"
- Completar formulario
- El sistema generará token JWT automáticamente

#### 3. Iniciar Sesión
- Usar credenciales: `admin@ecommerce.com` / `Password123`
- El sistema redirigirá al home
- Token JWT se almacena en localStorage

#### 4. Ver Productos
- El home muestra 10 productos de prueba
- Categorías en la parte superior
- Productos filtrados por categoría

#### 5. Ver Detalle de Producto
- Click en cualquier producto
- Se muestra descripción completa
- Botón "Agregar al Carrito"

#### 6. Gestionar "Mis Productos" (SELLER)
- Click en "Mis Productos" en el menú
- Ver productos del vendedor autenticado
- Botones para Editar/Eliminar

### Probar APIs con cURL

#### Obtener Productos
```bash
curl http://localhost:8080/api/products/all
```

#### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"Password123"}'
```

#### Obtener Producto por ID
```bash
curl http://localhost:8080/api/products/1
```

#### Obtener Mis Productos (requiere token)
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8080/api/seller/products
```

---

## 🛡️ Manejo de Excepciones

### Excepciones Centralizadas
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    // Maneja excepciones a nivel global
    // Convierte excepciones en responses HTTP
}
```

### Tipos de Excepciones
- **400 Bad Request**: Datos inválidos
- **401 Unauthorized**: No autenticado
- **403 Forbidden**: Sin permisos
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error del servidor

---

## 📊 Base de Datos

### Modelo de Datos

#### Entidades y Relaciones
```
User (1) ──< (N) Product
User (1) ──< (N) Order
Category (1) ──< (N) Product
Order (1) ──< (N) OrderItem
Product (1) ──< (N) OrderItem
```

#### Esquema de Tablas

**users**
- id, username, email, password, role, created_at, updated_at

**categories**
- id, name, description, created_at, updated_at

**products**
- id, name, description, price, stock, category_id, seller_id, created_at, updated_at

**orders**
- id, user_id, total, status, created_at

**order_items**
- id, order_id, product_id, quantity, price

---

## 🎨 Frontend - Componentes Principales

### Layout
- Header con navegación
- Sidebar (en pantallas grandes)
- Footer

### Páginas
- **Home**: Catálogo de productos
- **Product Detail**: Detalle con galería de imágenes
- **My Products**: Gestión de productos (SELLER)
- **Cart**: Carrito de compras
- **Profile**: Perfil de usuario

### Componentes Reutilizables
- `Button.jsx` - Botones estilizados
- `Input.jsx` - Inputs de formulario
- `LoadingSpinner.jsx` - Indicador de carga
- `ProductCard.jsx` - Tarjeta de producto

---

## 🔧 Configuración de Desarrollo

### application.yml
```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ecommerce_db
    username: root
    password: 
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

  security:
    jwt:
      secret: ${JWT_SECRET}
      expiration: 86400000
```

---

## 🐛 Solución de Problemas

### Backend no inicia
1. Verificar que Java 17 esté instalado
2. Verificar que MySQL esté corriendo (puerto 3306)
3. Verificar que el puerto 8080 no esté en uso
4. Revisar logs en la consola del backend

### Frontend no inicia
1. Verificar que Node.js esté instalado
2. Ejecutar `npm install` en ecommerce-frontend
3. Verificar que el puerto 3000 no esté en uso

### Error 404 en productos
- Verificar que el backend esté corriendo
- Verificar la URL: http://localhost:8080/api/products/all
- Revisar logs del backend

### Error de autenticación
- Verificar que el token JWT sea válido
- Verificar que el header `Authorization` esté presente
- Verificar que el token no haya expirado (24 horas)

### Productos duplicados
- Limpiar caché de JPA con `entityManager.clear()`
- Verificar constraints UNIQUE en la base de datos
- Usar `INSERT IGNORE` en data.sql

---

## 📚 Archivos de Documentación Adicional

- `GUIA-COMPLETA.md` - Guía detallada de uso
- `ecommerce-backend/README.md` - Documentación del backend
- `ecommerce-backend/SECURITY_DOCUMENTATION.md` - Seguridad
- `README-MYSQL.md` - Configuración MySQL
- `INSTALAR-NODEJS.md` - Instrucciones de Node.js

---

## 🎓 Conceptos Implementados

### Backend
- **Arquitectura en Capas**: Separación de responsabilidades
- **Inversión de Dependencias**: Inyección con Spring
- **RESTful API**: Diseño siguiendo principios REST
- **JPA/Hibernate**: ORM con lazy/eager loading
- **Bean Validation**: Validación automática
- **JWT**: Autenticación stateless
- **Spring Security**: Seguridad y autorización
- **Exception Handling**: Manejo centralizado

### Frontend
- **React Hooks**: useState, useEffect, useContext
- **Context API**: Gestión de estado global
- **React Router**: Enrutamiento SPA
- **Component Composition**: Componentes reutilizables
- **Conditional Rendering**: Renderizado condicional
- **Event Handling**: Manejo de eventos

---

## 🚦 Estado del Proyecto

### ✅ Completado
- Sistema de autenticación JWT
- CRUD completo de productos
- Gestión de categorías
- Sistema de roles y permisos
- Carrito de compras
- Página de detalle de productos
- Panel de vendedor (Mis Productos)
- Manejo de errores
- Validación de datos
- Lombok implementado
- Scripts de inicio automatizados

### 🔄 Mejoras Futuras
- Sistema de pagos
- Notificaciones en tiempo real
- Búsqueda avanzada con filtros
- Sistema de reviews y ratings
- Dashboard de estadísticas
- Reportes y exportación de datos

---

## 👨‍💻 Desarrollo

### Comandos Útiles

#### Backend
```bash
# Compilar proyecto
mvn clean install

# Ejecutar pruebas
mvn test

# Ejecutar aplicación
mvn spring-boot:run
```

#### Frontend
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Compilar para producción
npm run build
```

---

## 📞 Contacto y Soporte

Para problemas o preguntas sobre el proyecto:
1. Revisar la sección "Solución de Problemas"
2. Verificar logs en las consolas de backend y frontend
3. Consultar documentación en archivos README adicionales

---

## 📝 Notas Finales

Este proyecto demuestra:
- ✅ Arquitectura profesional en capas
- ✅ Integración completa frontend-backend
- ✅ Seguridad implementada correctamente
- ✅ Uso de tecnologías modernas
- ✅ Código limpio y mantenible
- ✅ Documentación completa

**¡Listo para presentar como Trabajo Práctico!**

---

*Última actualización: $(date)*
