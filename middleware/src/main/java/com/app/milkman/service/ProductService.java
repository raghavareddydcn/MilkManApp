package com.app.milkman.service;

import com.app.milkman.model.ProductDetails;
import com.app.milkman.model.ProductRegRequest;
import com.app.milkman.model.ProductRegResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {

    ProductRegResponse registerProduct(ProductRegRequest productReg);

    ProductRegResponse updateProduct(ProductRegRequest productReg);

    List<ProductDetails> getAllProducts(Pageable pageable);
}
