package com.app.milkman.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProductOrdersRepository extends JpaRepository<com.app.milkman.entity.ProductOrders, Void>, JpaSpecificationExecutor<com.app.milkman.entity.ProductOrders> {

}