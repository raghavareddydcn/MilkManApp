package com.app.milkman.repository;

import com.app.milkman.entity.ProductSubscriptions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProductSubscriptionsRepository extends JpaRepository<ProductSubscriptions, Void>, JpaSpecificationExecutor<ProductSubscriptions> {

}