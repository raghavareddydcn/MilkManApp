package com.dreamfutureone.milkmanui.data.model.api;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomerRegResponse extends ParentResponse {
    private String customerName;
    private String customerId;

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
