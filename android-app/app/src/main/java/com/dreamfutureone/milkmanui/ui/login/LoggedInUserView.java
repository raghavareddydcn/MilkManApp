package com.dreamfutureone.milkmanui.ui.login;

/**
 * Class exposing authenticated user details to the UI.
 */
class LoggedInUserView {
    private String displayName;
    private String customerId;
    private String authToken;
    //... other data fields that may be accessible to the UI

    LoggedInUserView(String displayName, String customerId, String authToken) {
        this.displayName = displayName;
        this.authToken = authToken;
        this.customerId = customerId;
    }

    String getDisplayName() {
        return displayName;
    }

    public String getCustomerId() {
        return customerId;
    }

    public String getAuthToken() {
        return authToken;
    }
}