package com.dreamfutureone.milkmanui.data.model.api;

import lombok.Data;

@Data
public class CustomerAuthRequest {

    private String emailIdOrPhone;
    private String authPin;

    public String getEmailIdOrPhone() {
        return emailIdOrPhone;
    }

    public void setEmailIdOrPhone(String emailIdOrPhone) {
        this.emailIdOrPhone = emailIdOrPhone;
    }

    public String getAuthPin() {
        return authPin;
    }

    public void setAuthPin(String authPin) {
        this.authPin = authPin;
    }
}
