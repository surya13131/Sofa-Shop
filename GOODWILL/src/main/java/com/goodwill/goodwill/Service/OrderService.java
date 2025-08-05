package com.goodwill.goodwill.Service;

import com.goodwill.goodwill.model.Order;
import com.goodwill.goodwill.model.Customer;
import com.goodwill.goodwill.Repository.OrderRepository;
import com.goodwill.goodwill.Repository.CustomerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order addOrder(Order order) {
        try {
            Customer incomingCustomer = order.getUser();
            String email = incomingCustomer.getEmail();

            Customer existingCustomer = customerRepository.findById(email).orElse(null);
            if (existingCustomer != null) {
                // Use managed existing customer
                order.setUser(existingCustomer);
            } else {
                // Save new customer before saving order
                customerRepository.save(incomingCustomer);
            }

            // OrderItems will be saved automatically because of CascadeType.ALL on Order.items

            return orderRepository.save(order);
        } catch (Exception e) {
            e.printStackTrace();  // log full error stack trace for debugging
            throw e;  // optionally rethrow or handle gracefully
        }
    }

    public Order updateOrder(Long id, Order updatedOrder) {
        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // For update, we assume Customer already exists or handled elsewhere
        existing.setUser(updatedOrder.getUser());
        existing.setItems(updatedOrder.getItems()); // cascade should handle saving
        existing.setTotal(updatedOrder.getTotal());
        existing.setLocation(updatedOrder.getLocation());
        existing.setDate(updatedOrder.getDate());

        return orderRepository.save(existing);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
