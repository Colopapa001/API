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
@Profile({"docker", "default"}) // Se ejecuta en perfil docker y default
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("🚀 Inicializando datos de prueba para Docker...");
        
        // Crear categorías
        Category electronicos = createCategoryIfNotExists("Electronicos", "Dispositivos electronicos y tecnologia");
        Category ropa = createCategoryIfNotExists("Ropa", "Vestimenta para hombres, mujeres y ninos");
        Category hogar = createCategoryIfNotExists("Hogar", "Articulos para el hogar y decoracion");
        Category deportes = createCategoryIfNotExists("Deportes", "Equipos y accesorios deportivos");
        Category libros = createCategoryIfNotExists("Libros", "Libros y material educativo");

        // Crear usuarios (con hashes BCrypt validos)
        createUserIfNotExists("admin", "admin@ecommerce.com", "Password123", "Admin", "User", Role.ADMIN);
        User seller = createUserIfNotExists("seller1", "seller1@ecommerce.com", "Password123", "Juan", "Perez", Role.SELLER);
        createUserIfNotExists("user1", "user1@ecommerce.com", "Password123", "Maria", "Garcia", Role.USER);

        // Crear productos sin imágenes (para agregar manualmente desde el frontend)
        createProductIfNotExists("iPhone 15", "Ultimo modelo de iPhone con camara mejorada", 
                new BigDecimal("999.99"), 10, electronicos, seller, "https://www.apple.com/newsroom/images/2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max/tile/Apple-iPhone-15-Pro-lineup-hero-230912.jpg.news_app_ed.jpg");
        createProductIfNotExists("Samsung Galaxy S24", "Smartphone Android de alta gama", 
                new BigDecimal("899.99"), 15, electronicos, seller, "https://media.flixcar.com/webp/synd-asset/Samsung-144461453-ar-galaxy-s24-plus-sm-s926bzkmaro-539290910--Download-Source--zoom.png");
        createProductIfNotExists("Camiseta Nike", "Camiseta deportiva de algodon", 
                new BigDecimal("29.99"), 50, ropa, seller, "https://www.dexter.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dw99435cde/products/NIDV9237-349/NIDV9237-349-1.JPG");
        createProductIfNotExists("Pantalon Adidas", "Pantalon deportivo comodo", 
                new BigDecimal("49.99"), 30, ropa, seller, "https://www.moov.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dw24ab4ad1/products/ADIL2488/ADIL2488-3.JPG");
        createProductIfNotExists("Sofa 3 plazas", "Sofa moderno para sala", 
                new BigDecimal("599.99"), 5, hogar, seller, "https://mubak.com/4000-large_default/sofa-3-plazas-2-relax-de-280x84x105-cm.jpg");
        createProductIfNotExists("Mesa de centro", "Mesa de centro de madera", 
                new BigDecimal("199.99"), 8, hogar, seller, "https://m.media-amazon.com/images/I/81X8REJ2XZL.jpg");
        createProductIfNotExists("Balon de futbol", "Balon oficial de futbol", 
                new BigDecimal("39.99"), 25, deportes, seller, "https://celadasa.vtexassets.com/arquivos/ids/467581/IX4011-1.jpg?v=638743572929830000");
        createProductIfNotExists("Raqueta de tenis", "Raqueta profesional de tenis", 
                new BigDecimal("89.99"), 12, deportes, seller, "https://www.wilsonstore.com.ar/cdn/shop/files/2_b4717d1b-ae9f-4fa6-808c-81e37dd39e40.jpg?v=1749652413&width=1200");
        createProductIfNotExists("Libro de Java", "Programacion en Java para principiantes", 
                new BigDecimal("49.99"), 20, libros, seller, "https://alfaomegaeditor.com.ar/wp-content/uploads/2020/10/TAPALIBRO.jpg");
        createProductIfNotExists("Novela de ficcion", "Novela de ciencia ficcion", 
                new BigDecimal("19.99"), 35, libros, seller, "https://vader-prod.s3.amazonaws.com/1676131517-41NCg3R6koL._SL500_.jpg");

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
                                             int stock, Category category, User seller, String imageUrl) {
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
        product.setImage(imageUrl);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        Product saved = productRepository.save(product);
        log.info("✓ Producto creado: {}", name);
        return saved;
    }
}

