package com.app.milkman.service.impl;

import com.app.milkman.entity.Customers;
import com.app.milkman.entity.Orders;
import com.app.milkman.entity.ProductOrders;
import com.app.milkman.entity.Products;
import com.app.milkman.model.*;
import com.app.milkman.repository.CustomersRepository;
import com.app.milkman.repository.OrdersRepository;
import com.app.milkman.repository.ProductOrdersRepository;
import com.app.milkman.repository.ProductsRepository;
import com.app.milkman.service.OrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.app.milkman.utils.Constants.*;

@Slf4j
@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private CustomersRepository customersRepository;

    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private ProductsRepository productsRepository;

    @Autowired
    private ProductOrdersRepository productOrdersRepository;

    @Override
    public OrderRegResponse createOrder(OrderRegRequest orderRegRequest) {
        log.info("[Order Creation] Creating order for customer ID: {}", orderRegRequest.getCustomerId());

        Customers customers = customersRepository.findByCustomerId(orderRegRequest.getCustomerId());

        Orders orders = new Orders();
        orders.setOrderId(UUID.randomUUID().toString());

        // customer details
        orders.setCustomerId(customers.getCustomerId());
        orders.setCustomerName(customers.getFirstName() + " " + customers.getLastName());
        orders.setPrimaryPhone(customers.getPrimaryPhone());
        orders.setEmailId(customers.getEmailId());
        orders.setAddress(customers.getAddress());
        orders.setPinCode(customers.getPinCode());
        orders.setLandmark(customers.getLandmark());

        //order detail
        orders.setOrderDateTime(LocalDateTime.now());
        orders.setDeliveryTimeSlot(orderRegRequest.getDeliveryTimeSlot());
        orders.setDeliveryDate(orderRegRequest.getDeliveryDate());
        orders.setDeliveryFrequency(orderRegRequest.getDeliveryFrequency());
        orders.setDeliveryCharge(BigDecimal.valueOf(orderRegRequest.getDeliveryCharge()));
        orders.setOrderStatus(ORDER_PLACED);
        orders.setStatus(ACTIVE);
        orders.setCreatedBy(orders.getCustomerName());
        orders.setCreatedTime(LocalDateTime.now());
        orders.setUpdatedBy(orders.getCustomerName());
        orders.setUpdatedTime(LocalDateTime.now());
        List<ProductOrders> productOrders = getProductOrders(orderRegRequest.getProductOrderReqs(), orders);

        //Order total calculation
        double orderTotal = productOrders.stream().mapToDouble(po -> po.getProductPrice().multiply(BigDecimal.valueOf(po.getQuantity())).doubleValue())
                .sum() + orderRegRequest.getDeliveryCharge();
        orders.setOrderTotal(BigDecimal.valueOf(orderTotal));

        Orders saveOrder = ordersRepository.save(orders);
        List<ProductOrders> saveProductOrders = productOrdersRepository.saveAll(productOrders);
        
        log.info("[Order Creation] Successfully created order ID: {} for customer: {} with {} items, Total: {}", 
                 saveOrder.getOrderId(), saveOrder.getCustomerName(), 
                 saveProductOrders.size(), saveOrder.getOrderTotal());

        //Response generation
        OrderRegResponse response = OrderRegResponse.builder().orderId(saveOrder.getOrderId()).build();
        response.setStatus(SUCCESS);
        response.setStatusCode(SUCCESS_CODE);
        return response;
    }

    @Override
    public List<OrderDetails> getAllOrders(Pageable pageable) {
        log.info("[Order Retrieval] Fetching all orders with pagination - Page: {}, Size: {}", 
                 pageable.getPageNumber(), pageable.getPageSize());
        Page<Orders> orders = ordersRepository.findAll(pageable);
        List<OrderDetails> orderDetails = getOrderDetails(orders);
        log.info("[Order Retrieval] Retrieved {} orders", orderDetails.size());
        return orderDetails;
    }

    @Override
    public List<OrderDetails> getAllOrdersByCustomerId(String customerId, Pageable pageable) {
        log.info("[Order Retrieval] Fetching orders for customer ID: {}", customerId);
        Page<Orders> orders = ordersRepository.findByCustomerId(customerId, pageable);
        List<OrderDetails> orderDetails = getOrderDetails(orders);
        log.info("[Order Retrieval] Retrieved {} orders for customer: {}", orderDetails.size(), customerId);
        return orderDetails;
    }


    private List<ProductOrders> getProductOrders(List<ProductOrdersReq> productOrderReq, Orders order) {

        List<ProductOrders> productOrdersList = productOrderReq.stream().map(po -> {
            Products product = productsRepository.findByProductId(po.getProductId());

            ProductOrders productOrder = new ProductOrders();
            productOrder.setProductOrderId(UUID.randomUUID().toString());
            productOrder.setOrders(order);
            productOrder.setProducts(product);
            productOrder.setProductName(product.getProductName());
            productOrder.setProductPrice(product.getProductPrice());
            productOrder.setQuantity(Long.valueOf(po.getQuantity()));

            productOrder.setCreatedBy(order.getCustomerName());
            productOrder.setCreatedTime(LocalDateTime.now());
            productOrder.setUpdatedBy(order.getCustomerName());
            productOrder.setUpdatedTime(LocalDateTime.now());
            productOrder.setStatus(ACTIVE);
            return productOrder;
        }).collect(Collectors.toList());
        return productOrdersList;
    }


    private List<OrderDetails> getOrderDetails(Page<Orders> orders){
        List<OrderDetails> orderDetailsList = new ArrayList<>();
        orders.forEach(order -> {
            OrderDetails orderDetails =  OrderDetails.builder().orderId(order.getOrderId())
                    .orderDateTime(order.getOrderDateTime())
                    .orderStatus(order.getOrderStatus())
                    .orderTotal(order.getOrderTotal())
                    .address(order.getAddress())
                    .customerId(order.getCustomerId())
                    .customerName(order.getCustomerName())
                    .deliveryCharge(order.getDeliveryCharge())
                    .deliveryDate(order.getDeliveryDate())
                    .deliveryTimeSlot(order.getDeliveryTimeSlot())
                    .deliveryFrequency(order.getDeliveryFrequency())
                    .emailId(order.getEmailId())
                    .landmark(order.getLandmark())
                    .pinCode(order.getPinCode())
                    .primaryPhone(order.getPrimaryPhone())
                    .status(order.getStatus())
                    .orderDateTime(order.getOrderDateTime())
                    .createdBy(order.getCreatedBy())
                    .createdTime(order.getCreatedTime())
                    .updatedBy(order.getUpdatedBy())
                    .updatedTime(order.getUpdatedTime())
                    .build();

            List<OrderProductDetails> orderProductDetailsList = order.getProductOrders().stream().map(po ->
                    OrderProductDetails.builder()
                            .productOrderId(po.getProductOrderId())
                            .orderId(order.getOrderId())
                            .productId(po.getProducts().getProductId())
                            .productName(po.getProductName())
                            .productPrice(po.getProductPrice())
                            .quantity(po.getQuantity())
                            .status(po.getStatus())
                            .createdBy(po.getCreatedBy())
                            .createdTime(po.getCreatedTime())
                            .updatedBy(po.getUpdatedBy())
                            .updatedTime(po.getUpdatedTime())
                            .build()
            ).collect(Collectors.toList());

            orderDetails.setOrderProductDetails(orderProductDetailsList);
            orderDetailsList.add(orderDetails);
        });

        return orderDetailsList;
    }


}
