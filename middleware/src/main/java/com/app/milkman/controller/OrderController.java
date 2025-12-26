package com.app.milkman.controller;

import com.app.milkman.component.JWTService;
import com.app.milkman.model.OrderDetails;
import com.app.milkman.model.OrderRegRequest;
import com.app.milkman.model.OrderRegResponse;
import com.app.milkman.service.OrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private OrderService orderService;
    
    @Autowired
    private JWTService jwtService;

    @PostMapping("/create")
    public OrderRegResponse createOrder(@RequestBody OrderRegRequest orderReq) {
        log.info("[Order Creation Request] Order creation endpoint invoked for customer: {}", 
                 orderReq.getCustomerId());
        
        return orderService.createOrder(orderReq);
    }

    @GetMapping("/getAllOrders")
    public List<OrderDetails> getAllOrders(@RequestHeader("Authorization") String authHeader,
                                          Pageable pageable) {
        String token = authHeader.substring(7);
        String role = jwtService.extractRole(token);
        String phoneNo = jwtService.extractPhoneNo(token);
        
        log.info("[Order List Request] Get all orders endpoint invoked by role: {} (Page: {}, Size: {})",
                 role, pageable.getPageNumber(), pageable.getPageSize());
        
        // If role is ADMIN, return all orders; otherwise return only customer's orders
        if ("ADMIN".equalsIgnoreCase(role)) {
            return orderService.getAllOrders(pageable);
        } else {
            log.info("[Order List Request] Filtering orders for customer: {}", phoneNo);
            return orderService.getAllOrdersByPhone(phoneNo, pageable);
        }
    }

    @GetMapping("/getAllOrders/{customerId}")
    public List<OrderDetails> getAllOrdersByCustomerId(@PathVariable("customerId") String customerId,
                                                       Pageable pageable) {
        log.info("[Order List Request] Get orders endpoint invoked for customer: {} (Page: {}, Size: {})",
                 customerId, pageable.getPageNumber(), pageable.getPageSize());
        
        return orderService.getAllOrdersByCustomerId(customerId, pageable);
    }
    
    @DeleteMapping("/delete/{orderId}")
    public void deleteOrder(@PathVariable("orderId") String orderId) {
        log.info("[Order Delete Request] Delete order endpoint invoked for order: {}", orderId);
        orderService.deleteOrder(orderId);
    }
    
    @PutMapping("/update")
    public OrderRegResponse updateOrder(@RequestBody OrderRegRequest orderReq,
                                       @RequestHeader("Authorization") String authHeader) {
        log.info("[Order Update Request] Order update endpoint invoked for order: {}", 
                 orderReq.getOrderId());
        
        return orderService.updateOrder(orderReq);
    }

}
