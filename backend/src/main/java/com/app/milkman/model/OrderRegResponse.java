package com.app.milkman.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderRegResponse extends ParentResponse {
    private String orderId;
}
