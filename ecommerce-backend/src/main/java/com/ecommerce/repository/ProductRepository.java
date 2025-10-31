package com.ecommerce.repository;

import com.ecommerce.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByCategoryId(Long categoryId);
    
    @Query("SELECT p FROM Product p WHERE p.seller.id = :userId")
    List<Product> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT p FROM Product p WHERE p.seller.id = :userId")
    Page<Product> findByUserId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Product> findByNameContainingIgnoreCase(@Param("name") String name);
    
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    List<Product> findByPriceBetween(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice);
    
    @Query("SELECT p FROM Product p WHERE p.stock > 0")
    List<Product> findInStock();
    
    @Query("SELECT p FROM Product p WHERE p.stock = 0")
    List<Product> findOutOfStock();
    
    @Query("SELECT p FROM Product p WHERE p.stock <= 5 AND p.stock > 0")
    List<Product> findLowStock();
    
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.stock > 0")
    List<Product> findByCategoryIdAndInStock(@Param("categoryId") Long categoryId);
    
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Product> searchProducts(@Param("search") String search);
    
    @Query("SELECT p FROM Product p WHERE " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:inStock IS NULL OR (:inStock = true AND p.stock > 0) OR (:inStock = false AND p.stock = 0))")
    Page<Product> findWithFilters(@Param("categoryId") Long categoryId,
                                 @Param("minPrice") BigDecimal minPrice,
                                 @Param("maxPrice") BigDecimal maxPrice,
                                 @Param("inStock") Boolean inStock,
                                 Pageable pageable);
    
    @Query("SELECT p FROM Product p ORDER BY p.createdAt DESC")
    Page<Product> findAllOrderByCreatedAtDesc(Pageable pageable);
    
    @Query("SELECT p FROM Product p ORDER BY p.price ASC")
    Page<Product> findAllOrderByPriceAsc(Pageable pageable);
    
    @Query("SELECT p FROM Product p ORDER BY p.price DESC")
    Page<Product> findAllOrderByPriceDesc(Pageable pageable);
    
    @Query("SELECT p FROM Product p ORDER BY p.name ASC")
    Page<Product> findAllOrderByNameAsc(Pageable pageable);
    
    boolean existsByName(String name);
}
