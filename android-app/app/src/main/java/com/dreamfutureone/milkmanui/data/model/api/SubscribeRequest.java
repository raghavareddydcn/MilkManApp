package com.dreamfutureone.milkmanui.data.model.api;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class SubscribeRequest {
    private String subscriptionId;
    private String customerId;
    private List<ProductOrdersReq> productOrderReqs;
    private String deliveryStartDate;
    private String deliveryEndDate;
    private String deliveryTimeSlot;
    private List<String> deliveryDays;
    private String deliveryFrequency;
    private String orderStatus;
    private double deliveryCharge;

    public String getSubscriptionId() {
        return subscriptionId;
    }

    public void setSubscriptionId(String subscriptionId) {
        this.subscriptionId = subscriptionId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public List<ProductOrdersReq> getProductOrderReqs() {
        return productOrderReqs;
    }

    public void setProductOrderReqs(List<ProductOrdersReq> productOrderReqs) {
        this.productOrderReqs = productOrderReqs;
    }

    public String getDeliveryStartDate() {
        return deliveryStartDate;
    }

    public void setDeliveryStartDate(String deliveryStartDate) {
        this.deliveryStartDate = deliveryStartDate;
    }

    public String getDeliveryEndDate() {
        return deliveryEndDate;
    }

    public void setDeliveryEndDate(String deliveryEndDate) {
        this.deliveryEndDate = deliveryEndDate;
    }

    public String getDeliveryTimeSlot() {
        return deliveryTimeSlot;
    }

    public void setDeliveryTimeSlot(String deliveryTimeSlot) {
        this.deliveryTimeSlot = deliveryTimeSlot;
    }

    public List<String> getDeliveryDays() {
        return deliveryDays;
    }

    public void setDeliveryDays(List<String> deliveryDays) {
        this.deliveryDays = deliveryDays;
    }

    public String getDeliveryFrequency() {
        return deliveryFrequency;
    }

    public void setDeliveryFrequency(String deliveryFrequency) {
        this.deliveryFrequency = deliveryFrequency;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public double getDeliveryCharge() {
        return deliveryCharge;
    }

    public void setDeliveryCharge(double deliveryCharge) {
        this.deliveryCharge = deliveryCharge;
    }
}
