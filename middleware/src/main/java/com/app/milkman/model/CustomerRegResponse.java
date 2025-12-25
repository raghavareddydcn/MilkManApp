package com.app.milkman.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomerRegResponse extends ParentResponse {
    private String customerName;
    private String customerId;
}
