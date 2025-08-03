package com.goodwill.goodwill.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "orders") // avoid conflict with SQL reserved word
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int total;
    private String location;
    private String date;
    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.REFRESH})

    @JoinColumn(name = "customer_email", referencedColumnName = "email")
    private Customer user;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "order_id") // maps OrderItem to this order
    private List<OrderItem> items;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public int getTotal() {
        return total;
    }

    public String getLocation() {
        return location;
    }

    public String getDate() {
        return date;
    }

    public Customer getUser() {
        return user;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setUser(Customer user) {
        this.user = user;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }
}
