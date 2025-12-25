package com.app.milkman.controller;

import com.app.milkman.model.ProductDetails;
import com.app.milkman.model.ProductRegRequest;
import com.app.milkman.model.ProductRegResponse;
import com.app.milkman.service.ProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/product")
@Slf4j
@RestController
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping("/register")
    public ProductRegResponse registerProduct(@RequestBody ProductRegRequest productReg) {
        log.info("[Product Registration Request] Product registration endpoint invoked for: {}", 
                 productReg.getProductName());
        
        return productService.registerProduct(productReg);
    }

    @PutMapping("/update")
    public ProductRegResponse updateProduct(@RequestBody ProductRegRequest productReg) {
        log.info("[Product Update Request] Product update endpoint invoked for ID: {}", 
                 productReg.getProductId());
        
        return productService.updateProduct(productReg);
    }

    @GetMapping("/getProducts")
    public List<ProductDetails> getAllProducts(Pageable pageable) {
        log.info("[Product List Request] Get all products endpoint invoked (Page: {}, Size: {})",
                 pageable.getPageNumber(), pageable.getPageSize());
        
        return productService.getAllProducts(pageable);
    }
}
