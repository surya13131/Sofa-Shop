package com.goodwill.goodwill.Contoller;

import com.goodwill.goodwill.model.Order;
import com.goodwill.goodwill.model.OrderItem;
import com.goodwill.goodwill.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private JavaMailSender mailSender;

    private final String ADMIN_EMAIL = "suryasurya20092005@gmail.com";

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        try {
            System.out.println("Received order: " + order);

            if (order == null || order.getUser() == null) {
                throw new IllegalArgumentException("Invalid order data: user information is missing.");
            }

            Order savedOrder = orderService.addOrder(order);
            sendOrderEmailToAdmin(savedOrder);
            return savedOrder;

        } catch (Exception e) {
            System.err.println("Error creating order: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @PutMapping("/{id}")
    public Order updateOrder(@PathVariable Long id, @RequestBody Order updatedOrder) {
        return orderService.updateOrder(id, updatedOrder);
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
    }

    private void sendOrderEmailToAdmin(Order order) {
        try {
            String customerName = order.getUser() != null && order.getUser().getName() != null
                    ? order.getUser().getName() : "N/A";
            String customerEmail = order.getUser() != null && order.getUser().getEmail() != null
                    ? order.getUser().getEmail() : "N/A";
            String customerPhone = order.getUser() != null && order.getUser().getPhone() != null
                    ? order.getUser().getPhone() : "N/A";
            String customerAddress = order.getUser() != null && order.getUser().getAddress() != null
                    ? order.getUser().getAddress() : "N/A";
            String orderDate = order.getDate() != null ? order.getDate().toString() : "N/A";

            StringBuilder itemsBuilder = new StringBuilder();
            itemsBuilder.append(String.format("%-25s %-12s %-10s %-12s\n",
                    "Item Name", "Price (₹)", "Quantity", "Subtotal (₹)"));
            itemsBuilder.append("---------------------------------------------------------------\n");

            double totalPrice = 0.0;
            if (order.getItems() != null && !order.getItems().isEmpty()) {
                for (OrderItem item : order.getItems()) {
                    String itemName = item.getName() != null ? item.getName() : "Unnamed Item";
                    double price = item.getPrice();
                    int quantity = item.getQuantity();
                    double subtotal = price * quantity;
                    totalPrice += subtotal;

                    itemsBuilder.append(String.format("%-25s ₹%-11.2f %-10d ₹%-11.2f\n",
                            itemName, price, quantity, subtotal));
                }
            } else {
                itemsBuilder.append("No items ordered.\n");
            }

            String emailBody = "A new order has been placed.\n\n" +
                    "Customer Name: " + customerName + "\n" +
                    "Customer Email: " + customerEmail + "\n" +
                    "Customer Phone: " + customerPhone + "\n" +
                    "Delivery Location: " + customerAddress + "\n" +
                    "Order Date: " + orderDate + "\n\n" +
                    "Ordered Items:\n" + itemsBuilder.toString() + "\n" +
                    String.format("Total Amount: ₹%.2f\n\n", totalPrice) +
                    "Please log in to the admin panel for more details.";

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(ADMIN_EMAIL);
            message.setSubject("New Order Received - Order ID: " + order.getId());
            message.setText(emailBody);

            mailSender.send(message);
            System.out.println("Order email sent to admin.");

        } catch (Exception e) {
            System.err.println("Error sending order email: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
