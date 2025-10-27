package com.ecommerce.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    
    @NotEmpty(message = "Order items are required")
    @Valid
    private List<OrderItemRequest> orderItems;
    
    @NotNull(message = "Shipping address is required")
    private String shippingAddress;
    
    @NotNull(message = "Payment method is required")
    private String paymentMethod;
    
    private String notes;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemRequest {
        
        @NotNull(message = "Product ID is required")
        private Long productId;
        
        @NotNull(message = "Quantity is required")
        private Integer quantity;
    }
}
