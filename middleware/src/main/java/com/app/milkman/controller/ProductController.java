package com.app.milkman.controller;

import com.app.milkman.component.RequireRole;
import com.app.milkman.model.ProductDetails;
import com.app.milkman.model.ProductRegRequest;
import com.app.milkman.model.ProductRegResponse;
import com.app.milkman.service.ProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/product")
@Slf4j
@RestController
public class ProductController {

    @Autowired
    private ProductService productService;

    @RequireRole({"ADMIN"})
    @PostMapping("/register")
    public ResponseEntity<ProductRegResponse> registerProduct(@RequestBody ProductRegRequest productReg) {
        log.info("[Product Registration Request] Product registration endpoint invoked for: {}", 
                 productReg.getProductName());
        
        ProductRegResponse response = productService.registerProduct(productReg);
        
        // Return appropriate HTTP status based on response
        if ("400".equals(response.getStatusCode())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } else if ("500".equals(response.getStatusCode())) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    @RequireRole({"ADMIN"})
    @PutMapping("/update")
    public ResponseEntity<ProductRegResponse> updateProduct(@RequestBody ProductRegRequest productReg) {
        log.info("[Product Update Request] Product update endpoint invoked for ID: {}", 
                 productReg.getProductId());
        
        ProductRegResponse response = productService.updateProduct(productReg);
        
        // Return appropriate HTTP status based on response
        if ("400".equals(response.getStatusCode())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } else if ("404".equals(response.getStatusCode())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } else if ("500".equals(response.getStatusCode())) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getProducts")
    public List<ProductDetails> getAllProducts(Pageable pageable) {
        log.info("[Product List Request] Get all products endpoint invoked (Page: {}, Size: {})",
                 pageable.getPageNumber(), pageable.getPageSize());
        
        return productService.getAllProducts(pageable);
    }
}
