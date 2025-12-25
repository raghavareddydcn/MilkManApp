package com.app.milkman.service;

import com.app.milkman.model.*;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SubscribeService {


    SubscribeResponse subscribe(SubscribeRequest subscribeRequest);
    List<SubscriptionDetails> getAllOrders(Pageable pageable);
    List<SubscriptionDetails> getAllSubscriptionsByCustomerId(String customerId, Pageable pageable);
}
