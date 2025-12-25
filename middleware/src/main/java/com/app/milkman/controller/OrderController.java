package com.app.milkman.controller;

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

    @PostMapping("/create")
    public OrderRegResponse createOrder(@RequestBody OrderRegRequest orderReq) {
        log.info("[Order Creation Request] Order creation endpoint invoked for customer: {}", 
                 orderReq.getCustomerId());
        
        return orderService.createOrder(orderReq);
    }

    @GetMapping("/getAllOrders")
    public List<OrderDetails> getAllOrders(Pageable pageable) {
        log.info("[Order List Request] Get all orders endpoint invoked (Page: {}, Size: {})",
                 pageable.getPageNumber(), pageable.getPageSize());
        
        return orderService.getAllOrders(pageable);
    }

    @GetMapping("/getAllOrders/{customerId}")
    public List<OrderDetails> getAllOrdersByCustomerId(@PathVariable("customerId") String customerId,
                                                       Pageable pageable) {
        log.info("[Order List Request] Get orders endpoint invoked for customer: {} (Page: {}, Size: {})",
                 customerId, pageable.getPageNumber(), pageable.getPageSize());
        
        return orderService.getAllOrdersByCustomerId(customerId, pageable);
    }

}
