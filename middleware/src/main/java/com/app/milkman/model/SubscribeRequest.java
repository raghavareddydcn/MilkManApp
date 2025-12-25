package com.app.milkman.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class SubscribeRequest {
    private String subscriptionId;
    private String customerId;
    private List<ProductOrdersReq> productOrderReqs;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate deliveryStartDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate deliveryEndDate;
    private String deliveryTimeSlot;
    private List<String> deliveryDays;
    private String deliveryFrequency;
    private String orderStatus;
    private double deliveryCharge;
}
