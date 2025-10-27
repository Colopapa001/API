package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductFilterDto {
    
    private String search;
    private Long categoryId;
    private Double minPrice;
    private Double maxPrice;
    private Boolean inStock;
    private String sortBy;
    private String sortDir;
}
