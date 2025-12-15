# 📚 Guía de Estudio - Examen Final
## Aplicaciones Interactivas - Defensa Oral

---

## 🎯 ÍNDICE

1. [Frontend React](#frontend-react)
2. [Backend Spring Boot](#backend-spring-boot)
3. [Preguntas Frecuentes](#preguntas-frecuentes)
4. [Conceptos de Seguridad](#conceptos-de-seguridad)
5. [Docker](#docker)

---

# FRONTEND REACT

## 1. Llamadas Asincrónicas, Promesas (async/await)

### ¿Qué son?
Las llamadas asincrónicas permiten ejecutar código sin bloquear el hilo principal. En React, se usan para comunicarse con APIs.

### Ejemplo en la Aplicación

**Archivo: `ecommerce-frontend/src/services/Api.js`**

```javascript
// Función asíncrona con async/await
export const getAllProducts = async () => {
  try {
    await delay(API_DELAY);
    const response = await fetch(`${API_BASE_URL}/products/all`);
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    throw error;
  }
};

// Uso en componente con useEffect
useEffect(() => {
  const loadProducts = async () => {
    try {
      const products = await getAllProducts();
      setProducts(products);
    } catch (error) {
      setError('Error cargando productos');
    }
  };
  loadProducts();
}, []);
```

### Conceptos Clave:
- **async/await**: Sintaxis moderna para manejar promesas
- **try/catch**: Manejo de errores en código asíncrono
- **fetch API**: Método nativo para hacer peticiones HTTP
- **Promesas**: Objetos que representan un valor futuro

---

## 2. Componentes (Reutilización, Responsabilidad Única)

### Principio de Responsabilidad Única
Cada componente debe tener una única responsabilidad.

### Ejemplo: `ProductCard.jsx`

```javascript
// Componente reutilizable - solo muestra un producto
const ProductCard = ({ id, name, price, description, images, onAddToCart }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="product-card">
      <img src={images[0]} alt={name} />
      <h3>{name}</h3>
      <p>{description}</p>
      <span>{price}</span>
      <Button onClick={handleViewDetails}>Ver Detalles</Button>
      <Button onClick={onAddToCart}>Agregar al Carrito</Button>
    </div>
  );
};
```

**Responsabilidades:**
- ✅ Mostrar información del producto
- ✅ Navegar al detalle
- ✅ Agregar al carrito (delegado al padre)

**NO hace:**
- ❌ Llamadas directas a la API
- ❌ Manejo de estado global
- ❌ Lógica de negocio compleja

---

## 3. HMR (Hot Module Replacement) y Virtual DOM

### HMR (Hot Module Replacement)
- **¿Qué es?**: Actualización automática del código en el navegador sin recargar la página completa
- **Ventaja**: Desarrollo más rápido, mantiene el estado de la aplicación
- **Cómo funciona**: React detecta cambios en el código y actualiza solo los componentes modificados

### Virtual DOM
- **¿Qué es?**: Representación en memoria del DOM real
- **Ventaja**: React compara el Virtual DOM con el DOM real y solo actualiza lo necesario (diffing)
- **Rendimiento**: Evita manipulaciones costosas del DOM real

**Ejemplo:**
```javascript
// React crea un Virtual DOM
const virtualDOM = {
  type: 'div',
  props: { className: 'product-card' },
  children: [
    { type: 'h3', props: {}, children: ['iPhone 15'] }
  ]
};

// Compara con el DOM real y solo actualiza lo diferente
```

---

## 4. Manejo de Estado (useState) y Propiedades (props, children)

### useState

**Archivo: `ecommerce-frontend/src/pages/ProductDetail/ProductDetail.jsx`**

```javascript
const ProductDetail = () => {
  // Estado local del componente
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Actualizar estado
  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  return (
    <div>
      {loading && <LoadingSpinner />}
      {error && <p>{error}</p>}
      {product && <ProductInfo product={product} />}
    </div>
  );
};
```

### Props (Propiedades)

```javascript
// Componente padre pasa props al hijo
<ProductCard 
  id={product.id}
  name={product.name}
  price={product.price}
  onAddToCart={handleAddToCart}  // Función como prop
/>

// Componente hijo recibe props
const ProductCard = ({ id, name, price, onAddToCart }) => {
  return <div>{name} - ${price}</div>;
};
```

### children

```javascript
// Layout recibe children
<Layout>
  <Home />  {/* children */}
</Layout>

// Layout usa children
const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>  {/* Renderiza el contenido */}
      <Footer />
    </div>
  );
};
```

---

## 5. Manejo de Efectos (useEffect)

### useEffect para Interacción con APIs

**Ejemplo Real: `ProductDetail.jsx`**

```javascript
useEffect(() => {
  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await getProductById(id);
      setProduct(productData);
    } catch (error) {
      setError('Error cargando producto');
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    loadProduct();
  }
}, [id]); // Dependencia: se ejecuta cuando cambia id
```

### Casos de Uso:

1. **Cargar datos al montar:**
```javascript
useEffect(() => {
  fetchData();
}, []); // Array vacío = solo al montar
```

2. **Actualizar cuando cambia una prop:**
```javascript
useEffect(() => {
  fetchUserData(userId);
}, [userId]); // Se ejecuta cuando userId cambia
```

3. **Limpiar recursos:**
```javascript
useEffect(() => {
  const interval = setInterval(() => {
    updateData();
  }, 1000);

  return () => clearInterval(interval); // Limpieza
}, []);
```

---

## 6. Manejo de Contexto (useContext) para Estado Global

### Implementación en la Aplicación

**Archivo: `ecommerce-frontend/src/context/AuthContext.jsx`**

```javascript
// 1. Crear el contexto
const AuthContext = createContext();

// 2. Provider que envuelve la app
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

  const login = async (usernameOrEmail, password) => {
    // Lógica de login
    dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { user } });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// 4. Uso en componentes
const MyComponent = () => {
  const { user, isAuthenticated, login } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? <p>Hola {user.username}</p> : <LoginForm />}
    </div>
  );
};
```

### Ventajas del Context API:
- ✅ Estado global accesible desde cualquier componente
- ✅ Evita prop drilling (pasar props por muchos niveles)
- ✅ Centraliza la lógica de autenticación

---

## 7. Renderizado Condicional

### Ejemplos en la Aplicación

```javascript
// 1. Operador ternario
{isAuthenticated ? (
  <UserDashboard />
) : (
  <LoginForm />
)}

// 2. Operador && (si es verdadero, renderiza)
{loading && <LoadingSpinner />}
{error && <ErrorMessage message={error} />}

// 3. Múltiples condiciones
{product ? (
  <ProductDetail product={product} />
) : loading ? (
  <LoadingSpinner />
) : error ? (
  <ErrorMessage />
) : (
  <EmptyState />
)}

// 4. Switch case con funciones
const renderContent = () => {
  switch (status) {
    case 'loading':
      return <LoadingSpinner />;
    case 'error':
      return <ErrorMessage />;
    case 'success':
      return <ProductList products={products} />;
    default:
      return null;
  }
};
```

---

## 8. React Router

### Configuración en la Aplicación

**Archivo: `ecommerce-frontend/src/App.jsx`**

```javascript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

<Router>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/" element={<Home />} />
    <Route path="/product/:id" element={<ProductDetail />} />
    <Route path="/cart" element={<Cart />} />
  </Routes>
</Router>
```

### useParams - Obtener Parámetros de la URL

```javascript
// URL: /product/123
const ProductDetail = () => {
  const { id } = useParams(); // id = "123"
  
  useEffect(() => {
    fetchProduct(id);
  }, [id]);
};
```

### useNavigate - Navegación Programática

```javascript
const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`); // Navegar a otra ruta
    // navigate(-1); // Volver atrás
    // navigate('/cart', { replace: true }); // Reemplazar historial
  };

  return <button onClick={handleClick}>Ver Detalles</button>;
};
```

### Rutas Protegidas

```javascript
// Componente de ruta protegida
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Uso
<Route
  path="/my-products"
  element={
    <ProtectedRoute>
      <MyProducts />
    </ProtectedRoute>
  }
/>
```

### Ventajas de React Router:
- ✅ Navegación sin recargar la página (SPA)
- ✅ URLs amigables y compartibles
- ✅ Historial del navegador funcional
- ✅ Lazy loading de rutas (mejor rendimiento)

---

## 9. Almacenamiento del Token

### Estrategias en la Aplicación

**1. localStorage (Implementado)**

```javascript
// Guardar token
localStorage.setItem('token', jwtToken);
localStorage.setItem('user', JSON.stringify(userData));

// Leer token
const token = localStorage.getItem('token');

// Eliminar token
localStorage.removeItem('token');
```

**Ventajas:**
- ✅ Persiste entre sesiones del navegador
- ✅ Accesible desde cualquier pestaña

**Desventajas:**
- ❌ Vulnerable a XSS (si hay scripts maliciosos)
- ❌ No se elimina automáticamente

**2. sessionStorage**

```javascript
sessionStorage.setItem('token', jwtToken);
// Se elimina al cerrar la pestaña
```

**3. Contexto + Cookies HTTP-only (Más Seguro)**

```javascript
// Backend envía cookie HTTP-only
response.setHeader('Set-Cookie', `token=${jwtToken}; HttpOnly; Secure; SameSite=Strict`);

// Frontend no accede directamente a la cookie
// Se envía automáticamente en cada request
```

**Ventajas:**
- ✅ No accesible desde JavaScript (protección XSS)
- ✅ Se envía automáticamente en requests

**Desventajas:**
- ❌ Más complejo de implementar
- ❌ Requiere configuración CORS

### Implementación Actual

**Archivo: `ecommerce-frontend/src/services/Api.js`**

```javascript
// Obtener headers con token
const getAuthHeaders = (hasJson = false) => {
  const headers = {};
  const token = localStorage.getItem('token');
  
  if (hasJson) headers['Content-Type'] = 'application/json';
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Uso en requests
const response = await fetch(`${API_BASE_URL}/products`, {
  method: 'POST',
  headers: getAuthHeaders(true),
  body: JSON.stringify(productData)
});
```

---

# BACKEND SPRING BOOT

## 1. Arquitectura en Capas

### Capas de la Aplicación

```
┌─────────────────────────────────────┐
│   CONTROLLER (Capa de Presentación) │
│   - Recibe requests HTTP            │
│   - Valida entrada                  │
│   - Delega a Service                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   SERVICE (Capa de Lógica Negocio)  │
│   - Implementa reglas de negocio    │
│   - Valida permisos                 │
│   - Transforma datos                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   REPOSITORY (Capa de Acceso Datos) │
│   - Interacción con BD              │
│   - Queries JPA                     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   MODEL (Capa de Dominio)           │
│   - Entidades JPA                   │
│   - Relaciones                      │
└─────────────────────────────────────┘
```

### Diferencia: Controller vs Service

**Controller (`ProductController.java`)**
```java
@RestController
@RequestMapping("/products")
public class ProductController {
    private final ProductService productService;
    
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        // Controller solo:
        // 1. Recibe el request HTTP
        // 2. Valida parámetros básicos
        // 3. Delega a Service
        // 4. Retorna respuesta HTTP
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }
}
```

**Service (`ProductService.java`)**
```java
@Service
public class ProductService {
    private final ProductRepository productRepository;
    
    public ProductDto getProductById(Long id) {
        // Service contiene:
        // 1. Lógica de negocio
        // 2. Validaciones complejas
        // 3. Transformaciones de datos
        // 4. Manejo de transacciones
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        return convertToDto(product);
    }
}
```

**Resumen:**
- **Controller**: Maneja HTTP, valida entrada básica, delega
- **Service**: Lógica de negocio, validaciones complejas, transformaciones

---

## 2. API RESTful - Endpoints CRUD

### Endpoints Implementados

**Productos:**

```java
GET    /api/products          // Listar todos (paginado)
GET    /api/products/all      // Listar todos (sin paginación)
GET    /api/products/{id}     // Obtener por ID
POST   /api/products          // Crear (SELLER/ADMIN)
PUT    /api/products/{id}     // Actualizar (SELLER/ADMIN)
DELETE /api/products/{id}     // Eliminar (SELLER/ADMIN)
PATCH  /api/products/{id}/stock // Actualizar stock
```

**Autenticación:**

```java
POST   /api/auth/register     // Registrar usuario
POST   /api/auth/login        // Iniciar sesión
GET    /api/auth/me           // Obtener usuario actual
```

**Órdenes:**

```java
GET    /api/orders            // Listar órdenes del usuario
POST   /api/orders            // Crear orden
GET    /api/orders/{id}       // Obtener orden por ID
```

### Principios REST:
- ✅ Usar verbos HTTP correctos (GET, POST, PUT, DELETE)
- ✅ URLs descriptivas y jerárquicas
- ✅ Códigos de estado HTTP apropiados (200, 201, 404, 400)
- ✅ JSON como formato de datos

---

## 3. Repositorios (@Repository con JpaRepository)

### Implementación

```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Métodos heredados de JpaRepository:
    // - save(), findById(), findAll(), delete(), etc.
    
    // Queries personalizadas
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByUserId(Long userId);
    
    // Query con JPQL
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    List<Product> findByPriceRange(@Param("minPrice") BigDecimal min, 
                                   @Param("maxPrice") BigDecimal max);
}
```

### Ventajas de JpaRepository:
- ✅ Métodos CRUD automáticos
- ✅ Paginación y ordenamiento
- ✅ Queries personalizadas
- ✅ Manejo de transacciones

---

## 4. Relaciones JPA

### Relaciones en la Aplicación

**Product.java:**
```java
@Entity
public class Product {
    // Relación Many-to-One con Category
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    // Relación Many-to-One con User (Seller)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;
}
```

**Order.java:**
```java
@Entity
public class Order {
    // Relación Many-to-One con User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // Relación One-to-Many con OrderItem
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems;
}
```

### Tipos de Relaciones:

1. **@ManyToOne**: Muchos productos pertenecen a una categoría
2. **@OneToMany**: Una orden tiene muchos items
3. **@OneToOne**: Un usuario tiene un perfil
4. **@ManyToMany**: Muchos usuarios tienen muchos roles

### Fetch Types:

- **LAZY**: Carga la relación solo cuando se accede (por defecto)
- **EAGER**: Carga la relación inmediatamente

```java
@ManyToOne(fetch = FetchType.LAZY)  // Carga solo cuando se accede
private Category category;
```

---

## 5. Manejo de Excepciones (@ControllerAdvice)

### Implementación Global

**Archivo: `GlobalExceptionHandler.java`**

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    // Manejar errores de validación
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.badRequest().body(errors);
    }
    
    // Manejar errores de autenticación
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleBadCredentials(
            BadCredentialsException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Invalid username/email or password");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }
    
    // Manejar errores de autorización
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDenied(
            AccessDeniedException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Access denied");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }
    
    // Manejar errores genéricos
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(
            RuntimeException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }
}
```

### Ventajas:
- ✅ Manejo centralizado de excepciones
- ✅ Respuestas consistentes
- ✅ Códigos HTTP apropiados
- ✅ Logging centralizado

---

## 6. Spring Security - Filtros y Protección de Endpoints

### Configuración de Seguridad

**Archivo: `SecurityConfig.java`**

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Deshabilitar CSRF para APIs REST con JWT
            .csrf(AbstractHttpConfigurer::disable)
            
            // Configurar CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Sesión sin estado (stateless) para JWT
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Configurar autorización
            .authorizeHttpRequests(authz -> authz
                // Endpoints públicos
                .requestMatchers("/auth/register", "/auth/login").permitAll()
                .requestMatchers("/products/**").permitAll()
                
                // Endpoints protegidos por rol
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/seller/**").hasAnyRole("SELLER", "ADMIN")
                
                // Requiere autenticación
                .anyRequest().authenticated()
            )
            // Agregar filtro JWT antes del filtro de autenticación
            .addFilterBefore(jwtAuthenticationFilter, 
                           UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### Filtro JWT Personalizado

**Archivo: `JwtAuthenticationFilter.java`**

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) {
        try {
            // 1. Extraer token del header Authorization
            String jwt = getJwtFromRequest(request);
            
            // 2. Validar token
            if (StringUtils.hasText(jwt) && jwtUtil.validateToken(jwt)) {
                // 3. Obtener username del token
                String username = jwtUtil.getUsernameFromToken(jwt);
                
                // 4. Cargar detalles del usuario
                UserDetails userDetails = userService.loadUserByUsername(username);
                
                // 5. Crear autenticación y establecer en SecurityContext
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            log.error("Error setting authentication", ex);
        }
        
        // Continuar con la cadena de filtros
        filterChain.doFilter(request, response);
    }
    
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Remover "Bearer "
        }
        return null;
    }
}
```

### Protección de Endpoints con Anotaciones

```java
@RestController
@RequestMapping("/products")
public class ProductController {
    
    // Público - no requiere autenticación
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        // ...
    }
    
    // Requiere rol SELLER o ADMIN
    @PostMapping
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<?> createProduct(@RequestBody ProductDto productDto) {
        // ...
    }
    
    // Requiere cualquier rol autenticado
    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasAnyRole('USER','SELLER','ADMIN')")
    public ResponseEntity<?> updateStock(@PathVariable Long id) {
        // ...
    }
}
```

---

## 7. JWT - Autenticación y Autorización

### ¿Qué es JWT?

**JWT (JSON Web Token)** es un estándar para transmitir información de forma segura entre partes como un objeto JSON.

### Estructura del Token:

```
header.payload.signature

Ejemplo:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwicm9sZSI6IlNFTExFUiIsImV4cCI6MTY5OTk5OTk5OX0.signature
```

1. **Header**: Tipo de token y algoritmo
2. **Payload**: Datos del usuario (username, roles, exp)
3. **Signature**: Firma verificable con la clave secreta

### Flujo de Autenticación:

```
1. Usuario envía credenciales → POST /api/auth/login
2. Backend valida credenciales
3. Backend genera JWT con datos del usuario
4. Backend retorna token al frontend
5. Frontend almacena token en localStorage
6. Frontend envía token en cada request: Authorization: Bearer <token>
7. Backend valida token en cada request
8. Backend procesa request si token es válido
```

### Cómo Viajan los Tokens:

**Frontend → Backend:**
```javascript
// En el header Authorization
headers: {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}
```

**Backend extrae y valida:**
```java
// En JwtAuthenticationFilter
String bearerToken = request.getHeader("Authorization");
String jwt = bearerToken.substring(7); // Remover "Bearer "
```

### Ventajas de JWT:
- ✅ Stateless (no requiere sesión en servidor)
- ✅ Escalable (funciona en múltiples servidores)
- ✅ Contiene información del usuario
- ✅ Verificable sin consultar base de datos

---

## 8. CORS (Cross-Origin Resource Sharing)

### ¿Qué es CORS?

**CORS** permite que un frontend en un dominio (ej: `localhost:3000`) haga requests a un backend en otro dominio (ej: `localhost:8080`).

### Configuración en la Aplicación

**Archivo: `SecurityConfig.java`**

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    
    // Orígenes permitidos
    configuration.setAllowedOriginPatterns(List.of("*"));
    
    // Métodos HTTP permitidos
    configuration.setAllowedMethods(Arrays.asList(
        "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
    ));
    
    // Headers permitidos
    configuration.setAllowedHeaders(Arrays.asList(
        "Authorization", "Content-Type", "Accept", 
        "X-Requested-With", "Origin"
    ));
    
    // Headers expuestos al frontend
    configuration.setExposedHeaders(Arrays.asList(
        "Authorization", "Content-Type"
    ));
    
    // Permitir credenciales (cookies, auth headers)
    configuration.setAllowCredentials(true);
    
    // Cache de preflight requests (1 hora)
    configuration.setMaxAge(3600L);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

### ¿Por qué es necesario?

Sin CORS, el navegador bloquea requests entre diferentes orígenes por seguridad (Same-Origin Policy).

**Ejemplo:**
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- Sin CORS: ❌ Bloqueado
- Con CORS: ✅ Permitido

---

## 9. Variables de Entorno

### Configuración en application.yml

```yaml
# application.yml
spring:
  datasource:
    url: ${DB_URL:jdbc:mysql://localhost:3306/ecommerce_db}
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:}

# application-docker.yml
spring:
  datasource:
    url: jdbc:mysql://${DB_HOST:db}:${DB_PORT:3306}/${DB_NAME:ecommerce_db}
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:rootpassword}
```

### Uso en Código

```java
@Value("${jwt.secret}")
private String jwtSecret;

@Value("${jwt.expiration}")
private Long jwtExpiration;
```

### Docker Compose

```yaml
services:
  backend:
    environment:
      DB_HOST: db
      DB_PORT: 3306
      DB_NAME: ecommerce_db
      DB_USERNAME: root
      DB_PASSWORD: rootpassword
      JWT_SECRET: myVerySecureJWTSecretKey...
```

### Ventajas:
- ✅ Separación de configuración por ambiente
- ✅ No hardcodear valores sensibles
- ✅ Fácil cambio sin recompilar

---

# PREGUNTAS FRECUENTES

## ¿Qué es XSS?

**XSS (Cross-Site Scripting)** es un ataque donde un atacante inyecta scripts maliciosos en páginas web que otros usuarios ven.

### Tipos:

1. **Stored XSS**: Script almacenado en la base de datos
2. **Reflected XSS**: Script reflejado en la respuesta
3. **DOM-based XSS**: Script ejecutado en el DOM

### Protección:

```javascript
// ❌ Peligroso
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Seguro
<div>{userInput}</div> // React escapa automáticamente

// ✅ Validación y sanitización
const sanitized = DOMPurify.sanitize(userInput);
```

### En la Aplicación:
- React escapa automáticamente el contenido
- Validación de entrada en backend
- Headers de seguridad HTTP

---

## ¿Qué es CSRF?

**CSRF (Cross-Site Request Forgery)** es un ataque donde un sitio malicioso hace requests en nombre de un usuario autenticado.

### Ejemplo:
1. Usuario está logueado en `ecommerce.com`
2. Usuario visita `malicious.com`
3. `malicious.com` envía un request a `ecommerce.com` usando las cookies del usuario
4. El request se ejecuta sin el conocimiento del usuario

### Protección:

**Para aplicaciones con cookies de sesión:**
```java
// Habilitar protección CSRF
.csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
```

**Para APIs REST con JWT:**
```java
// Deshabilitar CSRF (no es necesario)
.csrf(AbstractHttpConfigurer::disable)
```

**¿Por qué no es necesario con JWT?**
- Los tokens JWT se envían en headers, no en cookies
- El atacante no puede acceder a los headers desde otro sitio
- No hay cookies de sesión que proteger

---

## ¿Qué son los Tokens?

**Tokens** son strings que representan información de autenticación/autorización.

### Tipos:

1. **JWT (JSON Web Token)**: Token autofirmado con información del usuario
2. **OAuth Token**: Token de acceso para APIs de terceros
3. **Session Token**: Token de sesión tradicional

### JWT en la Aplicación:

```java
// Generar token
String token = jwtUtil.generateToken(username, roles);

// Validar token
boolean isValid = jwtUtil.validateToken(token);

// Extraer información
String username = jwtUtil.getUsernameFromToken(token);
List<String> roles = jwtUtil.getRolesFromToken(token);
```

---

## ¿Qué es Security?

**Spring Security** es un framework de seguridad para aplicaciones Java.

### Funcionalidades:

1. **Autenticación**: Verificar quién es el usuario
2. **Autorización**: Verificar qué puede hacer el usuario
3. **Protección contra ataques**: XSS, CSRF, SQL Injection
4. **Manejo de sesiones**: Stateless o stateful

### Componentes:

- **SecurityFilterChain**: Cadena de filtros de seguridad
- **AuthenticationManager**: Gestiona autenticación
- **UserDetailsService**: Carga detalles del usuario
- **PasswordEncoder**: Encripta contraseñas (BCrypt)

---

## ¿Qué es un Autenticador?

**Autenticador** es un componente que verifica las credenciales del usuario.

### En Spring Security:

```java
@Bean
public AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(userDetailsService);
    authProvider.setPasswordEncoder(passwordEncoder);
    return authProvider;
}
```

### Flujo:

```
1. Usuario envía credenciales
2. AuthenticationManager recibe credenciales
3. AuthenticationProvider valida credenciales
4. UserDetailsService carga usuario de BD
5. PasswordEncoder compara contraseñas
6. Si válido, crea Authentication object
7. Establece en SecurityContext
```

---

## ¿Cómo Viajan los Tokens?

### 1. Login (Frontend → Backend)

```javascript
// Frontend envía credenciales
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ usernameOrEmail, password })
});

// Backend retorna token
const { token } = await response.json();
localStorage.setItem('token', token);
```

### 2. Requests Autenticados (Frontend → Backend)

```javascript
// Frontend envía token en header
const response = await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(productData)
});
```

### 3. Backend Valida Token

```java
// JwtAuthenticationFilter intercepta request
String bearerToken = request.getHeader("Authorization");
String jwt = bearerToken.substring(7); // "Bearer " + token

if (jwtUtil.validateToken(jwt)) {
    String username = jwtUtil.getUsernameFromToken(jwt);
    // Cargar usuario y establecer autenticación
}
```

---

# DOCKER

## Dockerización de la Aplicación

### Dockerfile Backend

```dockerfile
# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
RUN apt-get update && apt-get install -y curl
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Dockerfile Frontend

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
ARG REACT_APP_API_URL=http://localhost:8080/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# Stage 2: Runtime
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: ecommerce_db
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

  backend:
    build: ./ecommerce-backend
    ports:
      - "8080:8080"
    environment:
      DB_HOST: db
      DB_PORT: 3306
      DB_NAME: ecommerce_db
      DB_USERNAME: root
      DB_PASSWORD: rootpassword
    depends_on:
      db:
        condition: service_healthy

  frontend:
    build: ./ecommerce-frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

### Comandos Docker:

```bash
# Construir imágenes
docker-compose build

# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose stop

# Eliminar contenedores y volúmenes
docker-compose down -v
```

---

# RESUMEN RÁPIDO

## Frontend
- ✅ **async/await**: Manejo de código asíncrono
- ✅ **Componentes**: Reutilizables, responsabilidad única
- ✅ **useState**: Estado local del componente
- ✅ **useEffect**: Efectos secundarios (API calls)
- ✅ **useContext**: Estado global compartido
- ✅ **React Router**: Navegación SPA, rutas protegidas
- ✅ **Tokens**: Almacenados en localStorage, enviados en headers

## Backend
- ✅ **Arquitectura en capas**: Controller → Service → Repository → Model
- ✅ **REST API**: Endpoints CRUD con verbos HTTP
- ✅ **JPA**: Relaciones @ManyToOne, @OneToMany
- ✅ **Spring Security**: Filtros, protección de endpoints, JWT
- ✅ **CORS**: Permite requests cross-origin
- ✅ **Excepciones**: Manejo centralizado con @ControllerAdvice

## Seguridad
- ✅ **JWT**: Tokens stateless para autenticación
- ✅ **XSS**: Prevenido con escape automático de React
- ✅ **CSRF**: Deshabilitado en APIs REST con JWT
- ✅ **CORS**: Configurado para permitir frontend
- ✅ **Variables de entorno**: Configuración sensible externa

---

**¡Éxito en el examen! 🎓**

