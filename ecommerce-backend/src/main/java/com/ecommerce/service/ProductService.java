package com.ecommerce.service;

import com.ecommerce.dto.CategoryDto;
import com.ecommerce.dto.ProductDto;
import com.ecommerce.dto.ProductFilterDto;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductService {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final com.ecommerce.repository.CategoryRepository categoryRepository;
    
    public ProductService(ProductRepository productRepository, UserRepository userRepository, com.ecommerce.repository.CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    public Page<ProductDto> getAllProducts(int page, int size, ProductFilterDto filter) {
        List<Product> products = productRepository.findAll();
        List<ProductDto> productDtos = products.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        return new PageImpl<>(productDtos);
    }

    public List<ProductDto> getAllProductsList() {
        // Clear JPA cache to get fresh data from database
        entityManager.clear();
        
        // Use JPQL to eagerly fetch category and seller, and use DISTINCT to avoid duplicates
        List<Product> products = entityManager.createQuery(
            "SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.category LEFT JOIN FETCH p.seller", 
            Product.class
        ).getResultList();
        
        // Remove duplicates by ID in case of any remaining duplicates
        Map<Long, Product> uniqueProducts = new HashMap<>();
        for (Product product : products) {
            uniqueProducts.putIfAbsent(product.getId(), product);
        }
        
        return uniqueProducts.values().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ProductDto getProductById(Long id) {
        // Use JPQL to eagerly fetch category and seller to avoid LazyInitializationException
        try {
            Product product = entityManager.createQuery(
                "SELECT p FROM Product p LEFT JOIN FETCH p.category LEFT JOIN FETCH p.seller WHERE p.id = :id", 
                Product.class
            ).setParameter("id", id)
            .getSingleResult();
            
            return convertToDto(product);
        } catch (jakarta.persistence.NoResultException e) {
            throw new RuntimeException("Product not found with id: " + id);
        }
    }

    public Product getProductEntityById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public ProductDto createProduct(ProductDto productDto, String username) {
        if (productRepository.existsByName(productDto.getName())) {
            throw new RuntimeException("Ya existe un producto con ese nombre");
        }
        // Buscar categoría
        if (productDto.getCategoryId() == null) {
            throw new RuntimeException("Category is required");
        }

        var category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + productDto.getCategoryId()));

        // Buscar seller (usuario que crea el producto)
        var seller = userRepository.findByUsernameOrEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        // Mapear DTO a entidad
        Product product = new Product();
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setStock(productDto.getStock());
        product.setImage(productDto.getImage());
        product.setImages(productDto.getImages());
        product.setCategory(category);
        product.setSeller(seller);

        Product saved = productRepository.save(product);
        return convertToDto(saved);
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductDto productDto, String username) {
        // Obtener entidad existente
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // Usuario que realiza la petición
        User requestingUser = userRepository.findByUsernameOrEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        boolean isAdmin = requestingUser.getRole() == com.ecommerce.model.Role.ADMIN;
        boolean isOwner = product.getSeller() != null && product.getSeller().getId().equals(requestingUser.getId());

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("No autorizado para actualizar este producto");
        }

        // Aplicar cambios permitidos
        if (productDto.getName() != null && !productDto.getName().isBlank()) {
            product.setName(productDto.getName());
        }
        if (productDto.getDescription() != null) {
            product.setDescription(productDto.getDescription());
        }
        if (productDto.getPrice() != null) {
            product.setPrice(productDto.getPrice());
        }
        if (productDto.getStock() != null) {
            product.setStock(productDto.getStock());
        }
        if (productDto.getImage() != null) {
            product.setImage(productDto.getImage());
        }
        if (productDto.getImages() != null) {
            product.setImages(productDto.getImages());
        }

        // Si cambia la categoría, validarla
        if (productDto.getCategoryId() != null) {
            var category = categoryRepository.findById(productDto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + productDto.getCategoryId()));
            product.setCategory(category);
        }

        Product saved = productRepository.save(product);
        return convertToDto(saved);
    }

    public void deleteProduct(Long id, String username) {
        // Find product
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // Find requesting user
        User requestingUser = userRepository.findByUsernameOrEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        // Allow delete if requesting user is ADMIN or the owner (seller) of the product
        boolean isAdmin = requestingUser.getRole() == com.ecommerce.model.Role.ADMIN;
        boolean isOwner = product.getSeller() != null && product.getSeller().getId().equals(requestingUser.getId());

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("No autorizado para eliminar este producto");
        }

        // Perform delete
        productRepository.delete(product);
    }

    @Transactional
    public ProductDto updateProductStock(Long id, Integer newStock, String username) {
        // Ejecutar dentro de una transacción para permitir inicializar asociaciones perezosas
        // cuando se convierta la entidad a DTO y se devuelva la respuesta.
        // Obtener producto
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // Buscar usuario solicitante
        User requestingUser = userRepository.findByUsernameOrEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        boolean isAdmin = requestingUser.getRole() == com.ecommerce.model.Role.ADMIN;
        boolean isOwner = product.getSeller() != null && product.getSeller().getId().equals(requestingUser.getId());

        // Allow update if requester is admin or the owner (seller).
        // Otherwise (other authenticated roles) permit only decreasing the stock
        // to support checkout flows by any authenticated user.
        if (!isAdmin && !isOwner) {
            if (newStock > product.getStock()) {
                throw new RuntimeException("No autorizado para actualizar stock de este producto");
            }
            // allowed: continue to update
        }

        if (newStock == null || newStock < 0) {
            throw new RuntimeException("Invalid stock value");
        }

        product.setStock(newStock);
        Product saved = productRepository.save(product);
        return convertToDto(saved);
    }

    public Page<ProductDto> getProductsByUser(Long userId, Pageable pageable) {
        // Clear JPA cache to get fresh data from database
        entityManager.clear();

        // Ensure user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Use JPQL to eagerly fetch category and seller
        List<Product> products = entityManager.createQuery(
            "SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.category LEFT JOIN FETCH p.seller WHERE p.seller.id = :userId",
            Product.class
        ).setParameter("userId", user.getId())
        .getResultList();

        List<ProductDto> productDtos = products.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return new PageImpl<>(productDtos);
    }

    public Page<ProductDto> getProductsByUsername(String username, int page, int size) {
        // Clear JPA cache to get fresh data from database
        entityManager.clear();
        
        User user = userRepository.findByUsernameOrEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        // Use JPQL to eagerly fetch category and seller
        List<Product> products = entityManager.createQuery(
            "SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.category LEFT JOIN FETCH p.seller WHERE p.seller.id = :userId", 
            Product.class
        ).setParameter("userId", user.getId())
        .getResultList();
        
        List<ProductDto> productDtos = products.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        return new PageImpl<>(productDtos);
    }

    public Map<String, Object> getSellerStats(String username) {
        User user = userRepository.findByUsernameOrEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        List<Product> products = productRepository.findByUserId(user.getId());
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", products.size());
        stats.put("totalStock", products.stream().mapToInt(Product::getStock).sum());
        stats.put("totalValue", products.stream().mapToDouble(p -> p.getPrice().doubleValue() * p.getStock()).sum());
        stats.put("productsInStock", products.stream().mapToInt(p -> p.getStock() > 0 ? 1 : 0).sum());
        stats.put("outOfStockProducts", products.stream().mapToInt(p -> p.getStock() == 0 ? 1 : 0).sum());
        
        return stats;
    }

    private ProductDto convertToDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStock(product.getStock());
        dto.setImage(product.getImage());
        dto.setImages(product.getImages());
        
        // Set category information
        if (product.getCategory() != null) {
            CategoryDto categoryDto = new CategoryDto();
            categoryDto.setId(product.getCategory().getId());
            categoryDto.setName(product.getCategory().getName());
            categoryDto.setDescription(product.getCategory().getDescription());
            dto.setCategory(categoryDto);
            dto.setCategoryId(product.getCategory().getId());
        }
        
        dto.setSellerId(product.getSeller() != null ? product.getSeller().getId() : null);
        dto.setSellerName(product.getSeller() != null ? product.getSeller().getFullName() : null);
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        return dto;
    }
}
