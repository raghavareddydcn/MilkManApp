package com.app.milkman.controller;

import com.app.milkman.component.RequireRole;
import com.app.milkman.entity.Customers;
import com.app.milkman.model.CustomerAuthRequest;
import com.app.milkman.model.CustomerAuthResponse;
import com.app.milkman.model.CustomerRegRequest;
import com.app.milkman.model.CustomerRegResponse;
import com.app.milkman.model.RefreshTokenRequest;
import com.app.milkman.model.RefreshTokenResponse;
import com.app.milkman.repository.CustomersRepository;
import com.app.milkman.service.CustomerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RequestMapping("/customer")
@RestController
@Slf4j
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomersRepository customersRepository;

    @PostMapping("/register")
    public CustomerRegResponse registration(@RequestBody CustomerRegRequest custReg) {
        log.info("[Customer Registration Request] Registration endpoint invoked for phone: {}", 
                 custReg.getPrimaryPhone());
        
        return customerService.registerCustomer(custReg);
    }

    @PostMapping("/authenticate")
    public CustomerAuthResponse authenticate(@RequestBody CustomerAuthRequest authRequest) {
        log.info("[Authentication Request] Authentication endpoint invoked for user: {}", 
                 authRequest.getEmailIdOrPhone());
        
        return customerService.authenticate(authRequest);
    }

    @PostMapping("/refresh-token")
    public RefreshTokenResponse refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        log.info("[Token Refresh Request] Token refresh endpoint invoked");
        
        return customerService.refreshToken(refreshTokenRequest);
    }

    @RequireRole({"ADMIN"})
    @GetMapping("/getAll")
    public List<Customers> getAllCustomers(Pageable pageable) {
        List<Customers> customers = customersRepository.findAll();
        log.info("[Customer Retrieval] Retrieved {} customers (Page: {}, Size: {})", 
                 customers.size(), pageable.getPageNumber(), pageable.getPageSize());
        
        return customers;
    }

    @GetMapping("/{customerId}")
    public Customers getCustomerById(@PathVariable String customerId) {
        log.info("[Customer View] Fetching customer details for ID: {}", customerId);
        
        Customers customer = customersRepository.findByCustomerId(customerId);
        
        if (customer != null) {
            log.info("[Customer View] Found customer: {} {} (ID: {})",
                     customer.getFirstName(), customer.getLastName(), customer.getCustomerId());
        } else {
            log.warn("[Customer View] Customer not found with ID: {}", customerId);
        }
        
        return customer;
    }

    @PutMapping("/update")
    public Customers updateCustomer(@RequestBody Customers customer) {
        log.info("\n========== CUSTOMER UPDATE REQUEST RECEIVED ==========");
        log.info("[Customer Update] Request Body ID: {}", customer.getId());
        log.info("[Customer Update] Request Body CustomerID: {}", customer.getCustomerId());
        log.info("[Customer Update] Request Body FirstName: {}", customer.getFirstName());
        log.info("[Customer Update] Request Body LastName: {}", customer.getLastName());
        log.info("[Customer Update] Request Body Email: {}", customer.getEmailId());
        log.info("[Customer Update] Request Body Phone: {}", customer.getPrimaryPhone());
        log.info("[Customer Update] Request Body Address: {}", customer.getAddress());
        log.info("[Customer Update] Request Body Pincode: {}", customer.getPinCode());
        log.info("[Customer Update] Request Body Role: {}", customer.getRole());
        
        log.info("[Customer Update] Calling customersRepository.save()...");
        Customers updatedCustomer = customersRepository.save(customer);
        
        log.info("[Customer Update] Database save completed");
        log.info("[Customer Update] Saved ID: {}", updatedCustomer.getId());
        log.info("[Customer Update] Saved CustomerID: {}", updatedCustomer.getCustomerId());
        log.info("[Customer Update] Saved FirstName: {}", updatedCustomer.getFirstName());
        log.info("[Customer Update] Saved LastName: {}", updatedCustomer.getLastName());
        log.info("[Customer Update] Saved Email: {}", updatedCustomer.getEmailId());
        log.info("========== CUSTOMER UPDATE COMPLETED ==========\n");
        
        return updatedCustomer;
    }

    @DeleteMapping("/{customerId}")
    public void deleteCustomer(@PathVariable String customerId) {
        log.info("[Customer Delete] Deleting customer with ID: {}", customerId);
        
        Customers customer = customersRepository.findByCustomerId(customerId);
        
        if (customer != null) {
            log.info("[Customer Delete] Deleting customer: {} {} (ID: {})",
                     customer.getFirstName(), customer.getLastName(), customer.getCustomerId());
            customersRepository.delete(customer);
            log.info("[Customer Delete] Successfully deleted customer with ID: {}", customerId);
        } else {
            log.warn("[Customer Delete] Customer not found with ID: {}", customerId);
        }
    }


}
