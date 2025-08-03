package com.goodwill.goodwill.Service;

import com.goodwill.goodwill.model.Customer;
import com.goodwill.goodwill.Repository.CustomerRepository;
import com.goodwill.goodwill.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository; // ✅ Inject UserRepository

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer addCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(String email, Customer updated) {
        Customer existing = customerRepository.findById(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        existing.setName(updated.getName());
        existing.setPhone(updated.getPhone());
        existing.setAddress(updated.getAddress());

        return customerRepository.save(existing);
    }
    @Transactional

    public void deleteCustomer(String email) {
        // ✅ Delete from both repositories
        customerRepository.deleteById(email);
        userRepository.deleteById(email);
    }
}
