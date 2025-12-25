package com.app.milkman.service.impl;

import com.app.milkman.component.JWTService;
import com.app.milkman.entity.Customers;
import com.app.milkman.model.CustomerAuthRequest;
import com.app.milkman.model.CustomerAuthResponse;
import com.app.milkman.model.CustomerRegRequest;
import com.app.milkman.model.CustomerRegResponse;
import com.app.milkman.model.RefreshTokenRequest;
import com.app.milkman.model.RefreshTokenResponse;
import com.app.milkman.repository.CustomersRepository;
import com.app.milkman.service.CustomerService;
import com.app.milkman.utils.Constants;
import com.app.milkman.component.EncryptDecrypt;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static com.app.milkman.utils.Constants.*;

@Slf4j
@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomersRepository customersRepository;

    @Autowired
    private JWTService jwtService;
    @Autowired
    private EncryptDecrypt encryptDecrypt;

    @Override
    public CustomerRegResponse registerCustomer(CustomerRegRequest custRequest) {
        log.info("[Customer Registration] Starting registration for phone: {}", custRequest.getPrimaryPhone());
        
        // Validate email format
        if (custRequest.getEmailId() != null && !custRequest.getEmailId().isEmpty()) {
            String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
            if (!custRequest.getEmailId().matches(emailRegex)) {
                log.warn("[Customer Registration] Invalid email format provided: {}", custRequest.getEmailId());
                CustomerRegResponse response = CustomerRegResponse.builder().build();
                response.setStatusCode("400");
                response.setStatus("FAILED");
                response.setErrorMsg("Invalid email format");
                return response;
            }
        }
        
        // Validate phone number format (10 digits)
        if (custRequest.getPrimaryPhone() == null || !custRequest.getPrimaryPhone().matches("^[0-9]{10}$")) {
            log.warn("[Customer Registration] Invalid phone number format: {}", custRequest.getPrimaryPhone());
            CustomerRegResponse response = CustomerRegResponse.builder().build();
            response.setStatusCode("400");
            response.setStatus("FAILED");
            response.setErrorMsg("Phone number must be exactly 10 digits");
            return response;
        }
        
        // Check if phone or email already exists
        log.debug("[Customer Registration] Checking for existing customer with phone: {} or email: {}", 
                  custRequest.getPrimaryPhone(), custRequest.getEmailId());
        List<Customers> existingCustomers = customersRepository.findByEmailOrPhone(
            custRequest.getEmailId(),
            custRequest.getPrimaryPhone()
        );
        
        if (!CollectionUtils.isEmpty(existingCustomers)) {
            log.warn("[Customer Registration] Customer already exists with phone: {} or email: {}", 
                     custRequest.getPrimaryPhone(), custRequest.getEmailId());
            CustomerRegResponse response = CustomerRegResponse.builder().build();
            response.setStatusCode("409");
            response.setStatus("FAILED");
            response.setErrorMsg("Phone number or email already registered");
            return response;
        }
        
        Customers customers = new Customers();
        customers.setCustomerId(UUID.randomUUID().toString());
        customers.setFirstName(custRequest.getFirstName());
        customers.setLastName(custRequest.getLastName());
        customers.setPrimaryPhone(custRequest.getPrimaryPhone());
        customers.setSecondaryPhone(custRequest.getSecondaryPhone());
        customers.setEmailId(custRequest.getEmailId());
        customers.setDob(custRequest.getDateOfBirth());
        customers.setAuthPin(encryptDecrypt.encrypt(custRequest.getAuthPin(), KEY));
        customers.setAddress(custRequest.getAddress());
        customers.setPinCode(custRequest.getPincode());
        customers.setLandmark(custRequest.getLandmark());
        customers.setStatus(Constants.ACTIVE);

        customers.setCreatedBy(custRequest.getFirstName());
        customers.setCreatedTime(LocalDateTime.now());
        customers.setUpdatedBy(custRequest.getFirstName());
        customers.setUpdatedTime(LocalDateTime.now());

        /* Insert */
        log.info("[Customer Registration] Saving new customer: {} {}", custRequest.getFirstName(), custRequest.getLastName());
        Customers customer = customersRepository.save(customers);
        log.info("[Customer Registration] Successfully registered customer with ID: {}", customer.getCustomerId());

        CustomerRegResponse response = CustomerRegResponse.builder().build();
        response.setCustomerName(customer.getFirstName() + " " + customer.getLastName());
        response.setCustomerId(customer.getCustomerId());
        response.setStatusCode(SUCCESS_CODE);
        response.setStatus(SUCCESS);

        return response;
    }

    @Override
    public CustomerAuthResponse authenticate(CustomerAuthRequest authRequest) {
        log.info("[Authentication] Login attempt for user: {}", authRequest.getEmailIdOrPhone());
        
        List<Customers> customers = customersRepository.getCustomersByEmailIdOrPrimaryPhoneAndAuthPin(
                authRequest.getEmailIdOrPhone(), 
                authRequest.getEmailIdOrPhone(), 
                encryptDecrypt.encrypt(authRequest.getAuthPin(), KEY));
        
        CustomerAuthResponse response = CustomerAuthResponse.builder().build();
        
        if (!CollectionUtils.isEmpty(customers)) {
            Customers customer = customers.get(0);
            log.info("[Authentication] Successful login for customer: {} {} (ID: {})", 
                     customer.getFirstName(), customer.getLastName(), customer.getCustomerId());
            
            response.setAuthToken(jwtService.GenerateToken(customer.getPrimaryPhone()));
            response.setRefreshToken(jwtService.generateRefreshToken(customer.getPrimaryPhone()));
            response.setStatusCode(SUCCESS_CODE);
            response.setStatus(SUCCESS);
            response.setCustomerName(customer.getFirstName() + " " + customer.getLastName());
            response.setCustomerId(customer.getCustomerId());
            return response;
        }
        
        log.warn("[Authentication] Failed login attempt for user: {}", authRequest.getEmailIdOrPhone());
        response.setStatusCode(NO_FOUND_CODE);
        response.setStatus(FAILED);
        return response;
    }
    
    @Override
    public RefreshTokenResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        log.info("[Token Refresh] Processing token refresh request");
        
        try {
            String refreshToken = refreshTokenRequest.getRefreshToken();
            String phoneNumber = jwtService.extractPhoneNoFromRefreshToken(refreshToken);
            
            if (jwtService.validateRefreshToken(refreshToken, phoneNumber)) {
                // Find customer by phone number
                List<Customers> customers = customersRepository.findByPrimaryPhone(phoneNumber);
                
                if (!CollectionUtils.isEmpty(customers)) {
                    Customers customer = customers.get(0);
                    log.info("[Token Refresh] Successfully refreshed tokens for customer: {} {} (ID: {})", 
                             customer.getFirstName(), customer.getLastName(), customer.getCustomerId());
                    
                    // Generate new tokens
                    String newAccessToken = jwtService.GenerateToken(phoneNumber);
                    String newRefreshToken = jwtService.generateRefreshToken(phoneNumber);
                    
                    return RefreshTokenResponse.builder()
                            .status(SUCCESS)
                            .authToken(newAccessToken)
                            .refreshToken(newRefreshToken)
                            .customerId(customer.getCustomerId())
                            .customerName(customer.getFirstName() + " " + customer.getLastName())
                            .build();
                }
            }
            
            log.warn("[Token Refresh] Invalid or expired refresh token");
            return RefreshTokenResponse.builder()
                    .status(FAILED)
                    .message("Invalid refresh token")
                    .build();
                    
        } catch (Exception e) {
            log.error("[Token Refresh] Token refresh failed with error: {}", e.getMessage(), e);
            return RefreshTokenResponse.builder()
                    .status(FAILED)
                    .message("Token refresh failed: " + e.getMessage())
                    .build();
        }
    }
}
