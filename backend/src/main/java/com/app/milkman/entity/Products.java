package com.app.milkman.entity;

import lombok.Data;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * $table.getTableComment()
 */
@Data
@Entity
@Table(name = "products", schema = "milkman")
public class Products implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "productid", nullable = false)
    private String productId;

    @Column(name = "productname")
    private String productName;

    @Column(name = "productdescription")
    private String productDescription;

    @Column(name = "productprice", nullable = false)
    private BigDecimal productPrice;

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

}
