package com.app.milkman.repository;

import com.app.milkman.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductsRepository extends JpaRepository<Products, Void>, JpaSpecificationExecutor<Products> {

    Products findByProductId(String productId);
}