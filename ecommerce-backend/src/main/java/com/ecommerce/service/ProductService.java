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
    
    public ProductService(ProductRepository productRepository, UserRepository userRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
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
        // Resto de la implementación
        throw new RuntimeException("Not implemented yet");
    }

    public ProductDto updateProduct(Long id, ProductDto productDto, String username) {
        // Simplified implementation
        throw new RuntimeException("Not implemented yet");
    }

    public void deleteProduct(Long id, String username) {
        // Simplified implementation
        throw new RuntimeException("Not implemented yet");
    }

    public ProductDto updateProductStock(Long id, Integer newStock, String username) {
        // Simplified implementation
        throw new RuntimeException("Not implemented yet");
    }

    public Page<ProductDto> getProductsByUser(Long userId, Pageable pageable) {
        // Simplified implementation
        throw new RuntimeException("Not implemented yet");
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
