package com.ecommerce.dto;

public class ProductFilterDto {
    
    private String search;
    private Long categoryId;
    private Double minPrice;
    private Double maxPrice;
    private Boolean inStock;
    private String sortBy;
    private String sortDir;
    
    public ProductFilterDto() {}
    
    public ProductFilterDto(String search, Long categoryId, Double minPrice, Double maxPrice, Boolean inStock, String sortBy, String sortDir) {
        this.search = search;
        this.categoryId = categoryId;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.inStock = inStock;
        this.sortBy = sortBy;
        this.sortDir = sortDir;
    }
    
    public String getSearch() {
        return search;
    }
    
    public void setSearch(String search) {
        this.search = search;
    }
    
    public Long getCategoryId() {
        return categoryId;
    }
    
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
    
    public Double getMinPrice() {
        return minPrice;
    }
    
    public void setMinPrice(Double minPrice) {
        this.minPrice = minPrice;
    }
    
    public Double getMaxPrice() {
        return maxPrice;
    }
    
    public void setMaxPrice(Double maxPrice) {
        this.maxPrice = maxPrice;
    }
    
    public Boolean getInStock() {
        return inStock;
    }
    
    public void setInStock(Boolean inStock) {
        this.inStock = inStock;
    }
    
    public String getSortBy() {
        return sortBy;
    }
    
    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }
    
    public String getSortDir() {
        return sortDir;
    }
    
    public void setSortDir(String sortDir) {
        this.sortDir = sortDir;
    }
}
