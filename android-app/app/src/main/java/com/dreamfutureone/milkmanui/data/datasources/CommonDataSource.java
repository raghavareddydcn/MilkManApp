package com.dreamfutureone.milkmanui.data.datasources;

import com.dreamfutureone.milkmanui.data.model.api.SubscribeRequest;
import retrofit.Callback;

public class CommonDataSource {


    public void subscribe(SubscribeRequest subscribeRequest, Callback subscribeCallback) {

        APICall.subscribe(subscribeRequest, subscribeCallback);

    }

    public void getProducts(Callback productCallback) {
        APICall.getProducts(productCallback);
    }


    public void getSubscriptions(String customerId, Callback subscriptionCallback) {
        APICall.getSubscriptions(customerId, subscriptionCallback);
    }
}
