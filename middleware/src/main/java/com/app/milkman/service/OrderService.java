package com.app.milkman.service;

import com.app.milkman.model.OrderDetails;
import com.app.milkman.model.OrderRegRequest;
import com.app.milkman.model.OrderRegResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public interface OrderService {

    public OrderRegResponse createOrder(OrderRegRequest orderRegRequest);

    List<OrderDetails> getAllOrders(Pageable pageable);

    List<OrderDetails> getAllOrdersByCustomerId(String customerId, Pageable pageable);
    
    List<OrderDetails> getAllOrdersByPhone(String phoneNo, Pageable pageable);
    
    void deleteOrder(String orderId);
    
    OrderRegResponse updateOrder(OrderRegRequest orderRegRequest);
}
