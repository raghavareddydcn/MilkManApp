package com.app.milkman.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RefreshTokenResponse {
    private String status;
    private String authToken;
    private String refreshToken;
    private String message;
    private String customerId;
    private String customerName;
    private String role;
}
