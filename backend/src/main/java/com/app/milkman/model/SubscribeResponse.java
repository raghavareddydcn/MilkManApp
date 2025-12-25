package com.app.milkman.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubscribeResponse extends ParentResponse {
    private String subscriptionId;
}
