package com.app.milkman.service.impl;

import com.app.milkman.entity.*;
import com.app.milkman.model.*;
import com.app.milkman.repository.CustomersRepository;
import com.app.milkman.repository.ProductSubscriptionsRepository;
import com.app.milkman.repository.ProductsRepository;
import com.app.milkman.repository.SubscriptionRepository;
import com.app.milkman.service.SubscribeService;
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
public class SubscribeServiceImpl implements SubscribeService {

    @Autowired
    private CustomersRepository customersRepository;
    @Autowired
    private ProductsRepository productsRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private ProductSubscriptionsRepository productSubscriptionsRepository;

    @Override
    public SubscribeResponse subscribe(SubscribeRequest subscribeRequest) {
        log.info("[Subscription Creation] Creating subscription for customer ID: {}", subscribeRequest.getCustomerId());

        Customers customers = customersRepository.findByCustomerId(subscribeRequest.getCustomerId());

        Subscriptions subscriptions = new Subscriptions();
        subscriptions.setSubscriptionId(UUID.randomUUID().toString());

        // customer details
        subscriptions.setCustomerId(customers.getCustomerId());
        subscriptions.setCustomerName(customers.getFirstName() + " " + customers.getLastName());
        subscriptions.setPrimaryPhone(customers.getPrimaryPhone());
        subscriptions.setEmailId(customers.getEmailId());
        subscriptions.setAddress(customers.getAddress());
        subscriptions.setPinCode(customers.getPinCode());
        subscriptions.setLandmark(customers.getLandmark());

        //subscription detail
        subscriptions.setOrderDateTime(LocalDateTime.now());
        subscriptions.setDeliveryTimeSlot(subscribeRequest.getDeliveryTimeSlot());
        subscriptions.setDeliveryStartDate(subscribeRequest.getDeliveryStartDate());
        subscriptions.setDeliveryEndDate(subscribeRequest.getDeliveryEndDate());
        subscriptions.setDeliveryFrequency(subscribeRequest.getDeliveryFrequency());
        subscriptions.setDeliveryDays(String.join(", ", subscribeRequest.getDeliveryDays()));
        subscriptions.setDeliveryCharge(BigDecimal.valueOf(subscribeRequest.getDeliveryCharge()));
        subscriptions.setOrderStatus(ORDER_PLACED);
        subscriptions.setStatus(ACTIVE);
        subscriptions.setCreatedBy(subscriptions.getCustomerName());
        subscriptions.setCreatedTime(LocalDateTime.now());
        subscriptions.setUpdatedBy(subscriptions.getCustomerName());
        subscriptions.setUpdatedTime(LocalDateTime.now());
        //get product details
        List<ProductSubscriptions> productSubscriptions = getProductOrders(subscribeRequest.getProductOrderReqs(), subscriptions);
        double orderTotal = productSubscriptions.stream().mapToDouble(po -> po.getProductPrice().multiply(BigDecimal.valueOf(po.getQuantity())).doubleValue())
                .sum() + subscribeRequest.getDeliveryCharge();
        subscriptions.setOrderTotal(BigDecimal.valueOf(orderTotal));

        Subscriptions subscriptionDetails = subscriptionRepository.save(subscriptions);
        List<ProductSubscriptions> saveProductOrders = productSubscriptionsRepository.saveAll(productSubscriptions);
        
        log.info("[Subscription Creation] Successfully created subscription ID: {} for customer: {} with {} products, Total: {} (from {} to {})", 
                 subscriptionDetails.getSubscriptionId(), subscriptionDetails.getCustomerName(), 
                 saveProductOrders.size(), subscriptionDetails.getOrderTotal(),
                 subscriptionDetails.getDeliveryStartDate(), subscriptionDetails.getDeliveryEndDate());

        //Response generation
        SubscribeResponse response = SubscribeResponse.builder().subscriptionId(subscriptions.getSubscriptionId()).build();
        response.setStatus(SUCCESS);
        response.setStatusCode(SUCCESS_CODE);
        return response;
    }

    private List<ProductSubscriptions> getProductOrders(List<ProductOrdersReq> productOrderReq, Subscriptions subscriptions) {

        List<ProductSubscriptions> productOrdersList = productOrderReq.stream().map(po -> {
            Products product = productsRepository.findByProductId(po.getProductId());

            ProductSubscriptions productSubscriptions = new ProductSubscriptions();
            productSubscriptions.setProductSubscriptionId(UUID.randomUUID().toString());
            productSubscriptions.setSubscriptions(subscriptions);
            productSubscriptions.setProducts(product);
            productSubscriptions.setProductName(product.getProductName());
            productSubscriptions.setProductPrice(product.getProductPrice());
            productSubscriptions.setQuantity(Long.valueOf(po.getQuantity()));

            productSubscriptions.setCreatedBy(subscriptions.getCustomerName());
            productSubscriptions.setCreatedTime(LocalDateTime.now());
            productSubscriptions.setUpdatedBy(subscriptions.getCustomerName());
            productSubscriptions.setUpdatedTime(LocalDateTime.now());
            productSubscriptions.setStatus(ACTIVE);
            return productSubscriptions;
        }).collect(Collectors.toList());
        return productOrdersList;
    }


    @Override
    public List<SubscriptionDetails> getAllOrders(Pageable pageable) {
        log.info("[Subscription Retrieval] Fetching all subscriptions with pagination - Page: {}, Size: {}", 
                 pageable.getPageNumber(), pageable.getPageSize());
        Page<Subscriptions> subscriptions = subscriptionRepository.findAll(pageable);
        List<SubscriptionDetails> details = getOrderDetails(subscriptions);
        log.info("[Subscription Retrieval] Retrieved {} subscriptions", details.size());
        return details;
    }

    @Override
    public List<SubscriptionDetails> getAllSubscriptionsByCustomerId(String customerId, Pageable pageable) {
        log.info("[Subscription Retrieval] Fetching subscriptions for customer ID: {}", customerId);
        Page<Subscriptions> subscriptions = subscriptionRepository.findByCustomerId(customerId, pageable);
        List<SubscriptionDetails> details = getOrderDetails(subscriptions);
        log.info("[Subscription Retrieval] Retrieved {} subscriptions for customer: {}", details.size(), customerId);
        return details;
    }

    private List<SubscriptionDetails> getOrderDetails(Page<Subscriptions> orders) {
        List<SubscriptionDetails> subscriptionDetailsList = new ArrayList<>();
        orders.forEach(subscription -> {
            SubscriptionDetails orderDetails = SubscriptionDetails.builder().subscriptionId(subscription.getSubscriptionId())
                    .orderDateTime(subscription.getOrderDateTime())
                    .orderStatus(subscription.getOrderStatus())
                    .orderTotal(subscription.getOrderTotal())
                    .address(subscription.getAddress())
                    .customerId(subscription.getCustomerId())
                    .customerName(subscription.getCustomerName())
                    .deliveryCharge(subscription.getDeliveryCharge())
                    .deliveryStartDate(subscription.getDeliveryStartDate())
                    .deliveryEndDate(subscription.getDeliveryEndDate())
                    .deliveryDays(subscription.getDeliveryDays())
                    .deliveryTimeSlot(subscription.getDeliveryTimeSlot())
                    .deliveryFrequency(subscription.getDeliveryFrequency())
                    .emailId(subscription.getEmailId())
                    .landmark(subscription.getLandmark())
                    .pinCode(subscription.getPinCode())
                    .primaryPhone(subscription.getPrimaryPhone())
                    .status(subscription.getStatus())
                    .orderDateTime(subscription.getOrderDateTime())
                    .createdBy(subscription.getCreatedBy())
                    .createdTime(subscription.getCreatedTime())
                    .updatedBy(subscription.getUpdatedBy())
                    .updatedTime(subscription.getUpdatedTime())
                    .build();

            List<SubscriptionProductDetails> orderProductDetailsList = subscription.getProductSubscriptions().stream().map(po ->
                    SubscriptionProductDetails.builder()
                            .productSubscriptionId(po.getProductSubscriptionId())
                            .subscriptionId(subscription.getSubscriptionId())
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

            orderDetails.setSubscriptionProductDetails(orderProductDetailsList);
            subscriptionDetailsList.add(orderDetails);
        });
        return subscriptionDetailsList;
    }
}
