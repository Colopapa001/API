package com.ecommerce.controller;

import com.ecommerce.dto.OrderDto;
import com.ecommerce.dto.ProductDto;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/seller")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
public class SellerController {
    
    private static final Logger log = LoggerFactory.getLogger(SellerController.class);
    
    private final ProductService productService;
    private final OrderService orderService;
    
    public SellerController(ProductService productService, OrderService orderService) {
        this.productService = productService;
        this.orderService = orderService;
    }

    @GetMapping("/products")
    public ResponseEntity<Page<ProductDto>> getMyProducts(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            String username = authentication.getName();
            Page<ProductDto> products = productService.getProductsByUsername(username, page, size);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("Error getting seller products: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<Page<OrderDto>> getMyOrders(
            Authentication authentication,
            Pageable pageable) {
        try {
            String username = authentication.getName();
            Page<OrderDto> orders = orderService.getOrdersBySeller(username, pageable);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            log.error("Error getting seller orders: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> statusUpdate,
            Authentication authentication) {
        try {
            String newStatus = statusUpdate.get("status");
            if (newStatus == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Status is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            String username = authentication.getName();
            OrderDto updatedOrder = orderService.updateOrderStatusBySeller(orderId, newStatus, username);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            log.error("Error updating order status: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            log.error("Error updating order status: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSellerStats(Authentication authentication) {
        try {
            String username = authentication.getName();
            Map<String, Object> stats = productService.getSellerStats(username);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error getting seller stats: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
