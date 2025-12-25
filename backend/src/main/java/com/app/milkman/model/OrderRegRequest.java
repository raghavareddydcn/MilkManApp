package com.app.milkman.model;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class OrderRegRequest {
    private String orderId;
    private String customerId;
    private List<ProductOrdersReq> productOrderReqs;
    private LocalDate deliveryDate;
    private String deliveryTimeSlot;
    private String deliveryFrequency;
    private String orderStatus;
    private double deliveryCharge;

}
