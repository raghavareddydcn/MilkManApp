package com.app.milkman.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductRegResponse extends ParentResponse {
    private String productName;
    private String productId;
}
