package com.goodwill.goodwill.Repository;

import com.goodwill.goodwill.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
