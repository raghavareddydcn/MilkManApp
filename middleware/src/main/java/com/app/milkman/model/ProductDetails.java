package com.app.milkman.model;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ProductDetails {

    private String productId;
    private String productName;
    private String productDescription;
    private BigDecimal productPrice;
    private String createdBy;
    private LocalDateTime createdTime;
    private String updatedBy;
    private LocalDateTime updatedTime;
    private String status;
}
