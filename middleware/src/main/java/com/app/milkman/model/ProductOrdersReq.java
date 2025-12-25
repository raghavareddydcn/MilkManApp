package com.app.milkman.model;

import lombok.Data;

@Data
public class ProductOrdersReq {
    private String productId;
    private int quantity;
}
