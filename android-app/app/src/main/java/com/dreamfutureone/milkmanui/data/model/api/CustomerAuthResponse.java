package com.dreamfutureone.milkmanui.data.model.api;

import lombok.Builder;
import lombok.Data;

@Data
public class CustomerAuthResponse extends ParentResponse {
    private String authToken;
    private String customerName;
    private String customerId;

    public String getAuthToken() {
        return authToken;
    }

    public void setAuthToken(String authToken) {
        this.authToken = authToken;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }
}
