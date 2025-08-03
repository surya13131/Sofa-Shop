package com.goodwill.goodwill.Repository;

import com.goodwill.goodwill.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
