package com.app.milkman.service;

import com.app.milkman.model.CustomerAuthRequest;
import com.app.milkman.model.CustomerAuthResponse;
import com.app.milkman.model.CustomerRegResponse;
import com.app.milkman.model.CustomerRegRequest;
import com.app.milkman.model.RefreshTokenRequest;
import com.app.milkman.model.RefreshTokenResponse;

public interface CustomerService {

    CustomerRegResponse registerCustomer(CustomerRegRequest custRegRequest);

    CustomerAuthResponse authenticate(CustomerAuthRequest authRequest);
    
    RefreshTokenResponse refreshToken(RefreshTokenRequest refreshTokenRequest);
}
