package com.dreamfutureone.milkmanui.data.datasources;

import com.dreamfutureone.milkmanui.data.model.api.*;
import retrofit.Call;
import retrofit.http.Body;
import retrofit.http.GET;
import retrofit.http.POST;
import retrofit.http.Path;

import java.util.List;

public interface APIService {


    @POST("/milkman/customer/authenticate")
    Call<CustomerAuthResponse> login(@Body CustomerAuthRequest request);

    @POST("/milkman/customer/register")
    Call<CustomerRegResponse> registerCustomer(@Body CustomerRegRequest custReg);

    @GET("/milkman/product/getProducts")
    Call<List<ProductDetails>> getProducts();

    @POST("/milkman/subscribe/create")
    Call<SubscribeResponse> subscribe(@Body SubscribeRequest subscribeRequest);

    @GET("/milkman/subscribe/getAllSubscriptions/{customerId}")
    Call<List<SubscriptionDetails>> getSubscriptionByCustomerId(@Path("customerId") String customerId);
}
