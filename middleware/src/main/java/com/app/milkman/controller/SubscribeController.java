package com.app.milkman.controller;

import com.app.milkman.component.JWTService;
import com.app.milkman.model.*;
import com.app.milkman.service.OrderService;
import com.app.milkman.service.SubscribeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/subscribe")
public class SubscribeController {

    @Autowired
    private SubscribeService subscribeService;

    @Autowired
    private JWTService jwtService;

    @PostMapping("/create")
    public SubscribeResponse createOrder(@RequestBody SubscribeRequest subscribeRequest) {
        log.info("[Subscription Creation Request] Subscription endpoint invoked for customer: {}", 
                 subscribeRequest.getCustomerId());
        
        return subscribeService.subscribe(subscribeRequest);
    }

    @GetMapping("/getAllSubscriptions")
    public List<SubscriptionDetails> getAllOrders(@RequestHeader("Authorization") String authHeader, Pageable pageable) {
        String token = authHeader.substring(7);
        String role = jwtService.extractRole(token);
        String phoneNo = jwtService.extractPhoneNo(token);
        
        log.info("[Subscription List Request] Get all subscriptions endpoint invoked (Role: {}, Page: {}, Size: {})",
                 role, pageable.getPageNumber(), pageable.getPageSize());
        
        List<SubscriptionDetails> subscriptions;
        if ("ADMIN".equalsIgnoreCase(role)) {
            subscriptions = subscribeService.getAllOrders(pageable);
        } else {
            subscriptions = subscribeService.getAllSubscriptionsByPhone(phoneNo, pageable);
        }
        
        if (!subscriptions.isEmpty()) {
            log.info("[Subscription List Response] Retrieved {} subscriptions for role: {}", 
                     subscriptions.size(), role);
        }
        return subscriptions;
    }

    @GetMapping("/getAllSubscriptions/{customerId}")
    public List<SubscriptionDetails> getAllOrdersByCustomerId(@PathVariable("customerId") String customerId,
                                                              Pageable pageable) {
        log.info("[Subscription List Request] Get subscriptions endpoint invoked for customer: {} (Page: {}, Size: {})",
                 customerId, pageable.getPageNumber(), pageable.getPageSize());
        
        return subscribeService.getAllSubscriptionsByCustomerId(customerId, pageable);
    }

    @PutMapping("/update")
    public SubscribeResponse updateSubscription(@RequestBody SubscribeRequest subscribeRequest,
                                                @RequestHeader("Authorization") String authHeader) {
        log.info("[Subscription Update Request] Update subscription endpoint invoked for subscription: {}",
                 subscribeRequest.getSubscriptionId());
        
        return subscribeService.updateSubscription(subscribeRequest);
    }

    @DeleteMapping("/delete/{subscriptionId}")
    public void deleteSubscription(@PathVariable("subscriptionId") String subscriptionId) {
        log.info("[Subscription Delete Request] Delete subscription endpoint invoked for subscription: {}",
                 subscriptionId);
        
        subscribeService.deleteSubscription(subscriptionId);
    }
}
