package com.goodwill.goodwill.Service;

import com.goodwill.goodwill.model.Order;
import com.goodwill.goodwill.model.OrderItem;
import com.goodwill.goodwill.Repository.OrderRepository;
import com.goodwill.goodwill.Repository.OrderItemRepository;
import com.goodwill.goodwill.Repository.CustomerRepository;
import com.goodwill.goodwill.model.Customer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    public Order addOrder(Order order) {
        Customer incomingCustomer = order.getUser();
        String email = incomingCustomer.getEmail();

        Customer existingCustomer = customerRepository.findById(email).orElse(null);
        if (existingCustomer != null) {
            order.setUser(existingCustomer); // re-use managed entity
        }

        return orderRepository.save(order);
    }



    public Order updateOrder(Long id, Order updatedOrder) {
        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Save or update order items
        List<OrderItem> updatedItems = orderItemRepository.saveAll(updatedOrder.getItems());

        existing.setUser(updatedOrder.getUser());
        existing.setItems(updatedItems);
        existing.setTotal(updatedOrder.getTotal());
        existing.setLocation(updatedOrder.getLocation());
        existing.setDate(updatedOrder.getDate());

        return orderRepository.save(existing);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
