package com.app.milkman.entity;

import lombok.Data;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * $table.getTableComment()
 */
@Data
@Entity
@Table(name = "orders", schema = "milkman")
public class Orders implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "orderid", nullable = false)
    private String orderId;

    @Column(name = "customerid")
    private String customerId;

    @Column(name = "customername")
    private String customerName;

    @Column(name = "pphone")
    private String primaryPhone;

    @Column(name = "emailid")
    private String emailId;

    @Column(name = "address")
    private String address;

    @Column(name = "pincode")
    private String pinCode;

    @Column(name = "landmark")
    private String landmark;

    @Column(name = "orderdatetime")
    private LocalDateTime orderDateTime;

    @Column(name = "deliverydate")
    private LocalDate deliveryDate;

    @Column(name = "deliverytimeslot")
    private String deliveryTimeSlot;

    @Column(name = "deliveryfrequency")
    private String deliveryFrequency;

    @Column(name = "orderstatus")
    private String orderStatus;

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

    @Column(name = "deliverycharge", nullable = false)
    private BigDecimal deliveryCharge;

    @Column(name = "ordertotal", nullable = false)
    private BigDecimal orderTotal;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "orderid", referencedColumnName = "orderid")
    private List<ProductOrders> productOrders;

}
