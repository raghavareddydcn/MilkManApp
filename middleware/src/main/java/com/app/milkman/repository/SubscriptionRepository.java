package com.app.milkman.repository;

import com.app.milkman.entity.Subscriptions;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface SubscriptionRepository extends JpaRepository<Subscriptions, String>, JpaSpecificationExecutor<Subscriptions> {

    Page<Subscriptions> findByCustomerId(String customerId, Pageable pageable);
}