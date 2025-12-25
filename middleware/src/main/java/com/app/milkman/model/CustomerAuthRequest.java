package com.app.milkman.model;

import lombok.Data;

@Data
public class CustomerAuthRequest {

    private String emailIdOrPhone;
    private String authPin;
}
