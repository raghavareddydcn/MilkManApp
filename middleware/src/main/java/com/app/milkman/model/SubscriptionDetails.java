package com.app.milkman.model;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class SubscriptionDetails {

    private String subscriptionId;
    private String customerId;
    private String customerName;
    private String primaryPhone;
    private String emailId;
    private String address;
    private String pinCode;
    private String landmark;
    private LocalDateTime orderDateTime;
    private LocalDate deliveryStartDate;
    private LocalDate deliveryEndDate;
    private String deliveryDays;
    private String deliveryTimeSlot;
    private String deliveryFrequency;
    private String orderStatus;
    private String createdBy;
    private LocalDateTime createdTime;
    private String updatedBy;
    private LocalDateTime updatedTime;
    private String status;
    private BigDecimal deliveryCharge;
    private BigDecimal orderTotal;
    private List<SubscriptionProductDetails> subscriptionProductDetails;
}
