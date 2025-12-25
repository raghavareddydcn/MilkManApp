package com.dreamfutureone.milkmanui.data.model.api;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubscribeResponse extends ParentResponse {
    private String subscriptionId;

    public String getSubscriptionId() {
        return subscriptionId;
    }

    public void setSubscriptionId(String subscriptionId) {
        this.subscriptionId = subscriptionId;
    }
}
