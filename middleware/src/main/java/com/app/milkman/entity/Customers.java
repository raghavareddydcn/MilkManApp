package com.app.milkman.entity;

import lombok.Data;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * $table.getTableComment()
 */
@Data
@Entity
@Table(name = "customers", schema = "milkman")
public class Customers implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "customerid")
    private String customerId;

    @Column(name = "firstname")
    private String firstName;

    @Column(name = "lastname")
    private String lastName;

    @Column(name = "pphone")
    private String primaryPhone;

    @Column(name = "sphone")
    private String secondaryPhone;

    @Column(name = "emailid")
    private String emailId;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "auth_pin")
    private String authPin;

    @Column(name = "address")
    private String address;

    @Column(name = "pincode")
    private String pinCode;

    @Column(name = "landmark")
    private String landmark;

    @Column(name = "createdby")
    private String createdBy;

    @Column(name = "createdtime")
    private LocalDateTime createdTime;

    @Column(name = "updatedby")
    private String updatedBy;

    @Column(name = "updatedtime")
    private LocalDateTime updatedTime;

    @Column(name = "status")
    private String status;

    @Column(name = "role")
    private String role;

}
