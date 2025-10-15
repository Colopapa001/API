package com.ecommerce.controller;

import com.ecommerce.dto.ProductDto;
import com.ecommerce.dto.ProductFilterDto;
import com.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {
    
    private static final Logger log = LoggerFactory.getLogger(ProductController.class);
    
    private final ProductService productService;
    
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<Page<ProductDto>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        try {
            ProductFilterDto filter = new ProductFilterDto();
            filter.setSearch(search);
            filter.setCategoryId(categoryId);
            filter.setMinPrice(minPrice);
            filter.setMaxPrice(maxPrice);
            filter.setInStock(inStock);
            filter.setSortBy(sortBy);
            filter.setSortDir(sortDir);
            
            Page<ProductDto> products = productService.getAllProducts(page, size, filter);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("Error getting products: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        try {
            ProductDto product = productService.getProductById(id);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            log.error("Product not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error getting product: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<?> createProduct(@Valid @RequestBody ProductDto productDto, Authentication authentication) {
        try {
            String username = authentication.getName();
            ProductDto createdProduct = productService.createProduct(productDto, username);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (RuntimeException e) {
            log.error("Error creating product: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            log.error("Error creating product: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDto productDto, Authentication authentication) {
        try {
            String username = authentication.getName();
            ProductDto updatedProduct = productService.updateProduct(id, productDto, username);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            log.error("Error updating product: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            log.error("Error updating product: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            productService.deleteProduct(id, username);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Error deleting product: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            log.error("Error deleting product: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateProductStock(@PathVariable Long id, @RequestBody Map<String, Integer> stockUpdate, Authentication authentication) {
        try {
            String username = authentication.getName();
            Integer newStock = stockUpdate.get("stock");
            if (newStock == null || newStock < 0) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid stock value");
                return ResponseEntity.badRequest().body(error);
            }
            
            ProductDto updatedProduct = productService.updateProductStock(id, newStock, username);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            log.error("Error updating product stock: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            log.error("Error updating product stock: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<Page<ProductDto>> getProductsByUser(@PathVariable Long userId, Pageable pageable) {
        try {
            Page<ProductDto> products = productService.getProductsByUser(userId, pageable);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("Error getting user products: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
