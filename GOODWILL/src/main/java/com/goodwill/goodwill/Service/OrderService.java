package com.goodwill.goodwill.Service;

import com.goodwill.goodwill.model.Order;
import com.goodwill.goodwill.model.Customer;
import com.goodwill.goodwill.Repository.OrderRepository;
import com.goodwill.goodwill.Repository.CustomerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private JavaMailSender mailSender; // For sending emails

    // ✅ Replace with your actual admin email
    private static final String ADMIN_EMAIL = "admin@goodwill.com";

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order addOrder(Order order) {
        try {
            Customer incomingCustomer = order.getUser();
            String email = incomingCustomer.getEmail();

            Customer existingCustomer = customerRepository.findById(email).orElse(null);
            if (existingCustomer != null) {
                order.setUser(existingCustomer);
            } else {
                customerRepository.save(incomingCustomer);
            }

            Order savedOrder = orderRepository.save(order);

            // ✅ Send order details to admin email only
            sendOrderDetailsToAdmin(savedOrder);

            return savedOrder;

        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public Order updateOrder(Long id, Order updatedOrder) {
        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        existing.setUser(updatedOrder.getUser());
        existing.setItems(updatedOrder.getItems());
        existing.setTotal(updatedOrder.getTotal());
        existing.setLocation(updatedOrder.getLocation());
        existing.setDate(updatedOrder.getDate());

        return orderRepository.save(existing);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    // ✅ Sends order details to the admin's email
    private void sendOrderDetailsToAdmin(Order order) {
        if (ADMIN_EMAIL != null && !ADMIN_EMAIL.isEmpty()) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(ADMIN_EMAIL);
            message.setSubject("📦 New Order Received - Order ID: " + order.getId());
            message.setText("A new order has been placed.\n\n" +
                    "Customer Name: " + order.getUser().getName() + "\n" +
                    "Customer Email: " + order.getUser().getEmail() + "\n" +
                    "Customer Phone: " + order.getUser().getPhone() + "\n" +
                    "Delivery Location: " + order.getLocation() + "\n" +
                    "Order Date: " + order.getDate() + "\n\n" +
                    "Ordered Items: " + order.getItems() + "\n" +
                    "Total Amount: $" + order.getTotal() + "\n\n" +
                    "Please log in to the admin panel for more details."
            );

            mailSender.send(message);
        }
    }
}
