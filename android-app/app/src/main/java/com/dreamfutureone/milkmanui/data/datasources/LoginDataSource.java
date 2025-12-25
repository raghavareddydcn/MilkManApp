package com.dreamfutureone.milkmanui.data.datasources;

import com.dreamfutureone.milkmanui.data.Result;
import com.dreamfutureone.milkmanui.data.model.LoggedInUser;
import com.dreamfutureone.milkmanui.data.model.api.CustomerAuthResponse;
import retrofit.Callback;

import java.io.IOException;

/**
 * Class that handles authentication w/ login credentials and retrieves user information.
 */
public class LoginDataSource {

    public void login(String username, String password, Callback loginCallback) {

        try {
            APICall.loginCustomer(username, password, loginCallback);


        } catch (Exception e) {
            throw e;
        }
    }

    public void logout() {
        // TODO: revoke authentication
    }
}