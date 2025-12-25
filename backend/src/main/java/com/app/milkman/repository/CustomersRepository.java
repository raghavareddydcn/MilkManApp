package com.app.milkman.repository;

import com.app.milkman.entity.Customers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomersRepository extends JpaRepository<Customers, Void>, JpaSpecificationExecutor<Customers> {

    @Query("SELECT c FROM Customers c WHERE (c.emailId = :emailOrPhone OR c.primaryPhone = :emailOrPhone) AND (c.authPin = :authPin OR :authPin = '') AND c.status = 'ACTIVE'")
    List<Customers> getCustomersByEmailIdOrPrimaryPhoneAndAuthPin(@Param("emailOrPhone") String emailId, @Param("emailOrPhone") String phone, @Param("authPin") String authPin);

    @Query("SELECT c FROM Customers c WHERE (c.emailId = :email OR c.primaryPhone = :phone) AND c.status = 'ACTIVE'")
    List<Customers> findByEmailOrPhone(@Param("email") String email, @Param("phone") String phone);
    
    @Query("SELECT c FROM Customers c WHERE c.primaryPhone = :phone AND c.status = 'ACTIVE'")
    List<Customers> findByPrimaryPhone(@Param("phone") String phone);

    Customers findByCustomerId(String customerId);

}