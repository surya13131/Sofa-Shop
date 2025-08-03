package com.goodwill.goodwill.Repository;

import com.goodwill.goodwill.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, String> {
    void deleteByEmail(String email);
}
