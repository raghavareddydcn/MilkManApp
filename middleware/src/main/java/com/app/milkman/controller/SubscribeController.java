package com.app.milkman.controller;

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

    @PostMapping("/create")
    public SubscribeResponse createOrder(@RequestBody SubscribeRequest subscribeRequest) {
        log.info("[Subscription Creation Request] Subscription endpoint invoked for customer: {}", 
                 subscribeRequest.getCustomerId());
        
        return subscribeService.subscribe(subscribeRequest);
    }

    @GetMapping("/getAllSubscriptions")
    public List<SubscriptionDetails> getAllOrders(Pageable pageable) {
        log.info("[Subscription List Request] Get all subscriptions endpoint invoked (Page: {}, Size: {})",
                 pageable.getPageNumber(), pageable.getPageSize());
        
        return subscribeService.getAllOrders(pageable);
    }

    @GetMapping("/getAllSubscriptions/{customerId}")
    public List<SubscriptionDetails> getAllOrdersByCustomerId(@PathVariable("customerId") String customerId,
                                                              Pageable pageable) {
        log.info("[Subscription List Request] Get subscriptions endpoint invoked for customer: {} (Page: {}, Size: {})",
                 customerId, pageable.getPageNumber(), pageable.getPageSize());
        
        return subscribeService.getAllSubscriptionsByCustomerId(customerId, pageable);
    }
}
