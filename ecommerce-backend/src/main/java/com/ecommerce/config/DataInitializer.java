package com.ecommerce.config;

import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import com.ecommerce.model.Role;
import com.ecommerce.model.User;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
@Profile("docker") // Solo se ejecuta en perfil docker
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("🚀 Inicializando datos de prueba para Docker...");
        
        // Crear categorías
        Category electronicos = createCategoryIfNotExists("Electrónicos", "Dispositivos electrónicos y tecnología");
        Category ropa = createCategoryIfNotExists("Ropa", "Vestimenta para hombres, mujeres y niños");
        Category hogar = createCategoryIfNotExists("Hogar", "Artículos para el hogar y decoración");
        Category deportes = createCategoryIfNotExists("Deportes", "Equipos y accesorios deportivos");
        Category libros = createCategoryIfNotExists("Libros", "Libros y material educativo");

        // Crear usuarios (con hashes BCrypt válidos)
        createUserIfNotExists("admin", "admin@ecommerce.com", "Password123", "Admin", "User", Role.ADMIN);
        User seller = createUserIfNotExists("seller1", "seller1@ecommerce.com", "Password123", "Juan", "Pérez", Role.SELLER);
        createUserIfNotExists("user1", "user1@ecommerce.com", "Password123", "María", "García", Role.USER);

        // Crear productos
        createProductIfNotExists("iPhone 15", "Último modelo de iPhone con cámara mejorada", 
                new BigDecimal("999.99"), 10, electronicos, seller);
        createProductIfNotExists("Samsung Galaxy S24", "Smartphone Android de alta gama", 
                new BigDecimal("899.99"), 15, electronicos, seller);
        createProductIfNotExists("Camiseta Nike", "Camiseta deportiva de algodón", 
                new BigDecimal("29.99"), 50, ropa, seller);
        createProductIfNotExists("Pantalón Adidas", "Pantalón deportivo cómodo", 
                new BigDecimal("49.99"), 30, ropa, seller);
        createProductIfNotExists("Sofá 3 plazas", "Sofá moderno para sala", 
                new BigDecimal("599.99"), 5, hogar, seller);
        createProductIfNotExists("Mesa de centro", "Mesa de centro de madera", 
                new BigDecimal("199.99"), 8, hogar, seller);
        createProductIfNotExists("Balón de fútbol", "Balón oficial de fútbol", 
                new BigDecimal("39.99"), 25, deportes, seller);
        createProductIfNotExists("Raqueta de tenis", "Raqueta profesional de tenis", 
                new BigDecimal("89.99"), 12, deportes, seller);
        createProductIfNotExists("Libro de Java", "Programación en Java para principiantes", 
                new BigDecimal("49.99"), 20, libros, seller);
        createProductIfNotExists("Novela de ficción", "Novela de ciencia ficción", 
                new BigDecimal("19.99"), 35, libros, seller);

        log.info("✅ Datos de prueba inicializados correctamente");
    }

    private Category createCategoryIfNotExists(String name, String description) {
        return categoryRepository.findByName(name)
                .orElseGet(() -> {
                    Category category = new Category();
                    category.setName(name);
                    category.setDescription(description);
                    Category saved = categoryRepository.save(category);
                    log.info("✓ Categoría creada: {}", name);
                    return saved;
                });
    }

    private User createUserIfNotExists(String username, String email, String password, 
                                       String firstName, String lastName, Role role) {
        if (userRepository.existsByUsername(username)) {
            return userRepository.findByUsername(username).get();
        }
        if (userRepository.existsByEmail(email)) {
            return userRepository.findByEmail(email).get();
        }
        
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(role);
        user.setIsEnabled(true);
        user.setIsAccountNonLocked(true);
        user.setFailedLoginAttempts(0);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        User saved = userRepository.save(user);
        log.info("✓ Usuario creado: {} ({})", username, role);
        return saved;
    }

    private Product createProductIfNotExists(String name, String description, BigDecimal price, 
                                             int stock, Category category, User seller) {
        if (productRepository.existsByName(name)) {
            log.info("• Producto ya existe: {}", name);
            return productRepository.findByNameContainingIgnoreCase(name).stream()
                    .filter(p -> p.getName().equalsIgnoreCase(name))
                    .findFirst()
                    .get();
        }
        
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStock(stock);
        product.setCategory(category);
        product.setSeller(seller);
        product.setImage(null);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        Product saved = productRepository.save(product);
        log.info("✓ Producto creado: {}", name);
        return saved;
    }
}

