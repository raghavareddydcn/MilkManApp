package com.app.milkman.model;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class SubscriptionProductDetails {

    private String productSubscriptionId;
    private String subscriptionId;
    private String productId;
    private String productName;
    private BigDecimal productPrice;
    private Long quantity;
    private String createdBy;
    private LocalDateTime createdTime;
    private String updatedBy;
    private LocalDateTime updatedTime;
    private String status;
}
