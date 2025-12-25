package com.app.milkman.model;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Data
public class CustomerRegRequest {

    private String customerId;
    private String firstName;
    private String lastName;
    private String primaryPhone;
    private String secondaryPhone;
    private String emailId;
    private LocalDate dateOfBirth;
    private String authPin;
    private String address;
    private String pincode;
    private String landmark;
    private String status;
}
