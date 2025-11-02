package com.ecommerce.service;

import com.ecommerce.dto.CreateOrderRequest;
import com.ecommerce.dto.OrderDto;
import com.ecommerce.dto.OrderItemDto;
import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import com.ecommerce.repository.OrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // Minimal createOrder implementation (kept simple for now)
    public OrderDto createOrder(CreateOrderRequest orderRequest, String username) {
        throw new RuntimeException("Not implemented yet");
    }

    // Return all orders mapped to DTOs - used by frontend to display activity
    public List<OrderDto> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(this::toDto).collect(Collectors.toList());
    }

    public Page<OrderDto> getOrdersByUser(String username, Pageable pageable) {
        // Optional: implement paging by querying repository
        throw new RuntimeException("Not implemented yet");
    }

    public OrderDto getOrderById(Long id, String username) {
        throw new RuntimeException("Not implemented yet");
    }

    public Page<OrderDto> getOrdersBySeller(String username, Pageable pageable) {
        // Simplified implementation - return empty page for now
        return Page.empty();
    }

    public OrderDto updateOrderStatusBySeller(Long id, String newStatus, String username) {
        throw new RuntimeException("Not implemented yet");
    }

    public OrderDto updateOrderStatus(Long id, String newStatus, String username) {
        throw new RuntimeException("Not implemented yet");
    }

    // Helper to map Order entity to OrderDto
    private OrderDto toDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setUserId(order.getUser() != null ? order.getUser().getId() : null);
        dto.setUserName(order.getUser() != null ? order.getUser().getUsername() : null);
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setNotes(order.getNotes());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        List<OrderItemDto> items = null;
        if (order.getOrderItems() != null) {
            items = order.getOrderItems().stream().map(this::toItemDto).collect(Collectors.toList());
        }
        dto.setOrderItems(items);
        return dto;
    }

    private OrderItemDto toItemDto(OrderItem item) {
        OrderItemDto dto = new OrderItemDto();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct() != null ? item.getProduct().getId() : null);
        dto.setProductName(item.getProduct() != null ? item.getProduct().getName() : null);
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setSubtotal(item.getSubtotal());
        return dto;
    }
}
