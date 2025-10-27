package com.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    
    private Long id;
    
    @NotBlank(message = "Product name is required")
    private String name;
    
    @NotBlank(message = "Product description is required")
    private String description;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;
    
    @NotNull(message = "Stock is required")
    @PositiveOrZero(message = "Stock must be zero or positive")
    private Integer stock;
    
    private String image;
    private List<String> images;
    
    // Category can be null for existing products without category
    private CategoryDto category;
    
    // Campo adicional para facilitar el acceso directo al ID de categoría
    private Long categoryId;
    
    private Long sellerId;
    private String sellerName;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Alias for frontend compatibility
    public String getTitle() {
        return name;
    }
    
    public void setTitle(String title) {
        this.name = title;
    }
}
