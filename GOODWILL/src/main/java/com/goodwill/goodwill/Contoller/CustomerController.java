package com.goodwill.goodwill.Contoller;

import com.goodwill.goodwill.model.Customer;
import com.goodwill.goodwill.model.User;
import com.goodwill.goodwill.Service.CustomerService;
import com.goodwill.goodwill.Service.UserService;
import com.goodwill.goodwill.dto.CustomerDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private UserService userService;

    // ✅ Convert Entity to DTO
    private CustomerDTO toDTO(Customer customer) {
        return new CustomerDTO(
                customer.getName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getAddress()
        );
    }

    // ✅ Convert DTO to Entity
    private Customer toEntity(CustomerDTO dto) {
        Customer c = new Customer();
        c.setName(dto.getName());
        c.setEmail(dto.getEmail());
        c.setPhone(dto.getPhone());
        c.setAddress(dto.getAddress());
        return c;
    }

    @GetMapping
    public List<CustomerDTO> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        List<User> users = userService.getAllUsers();

        // Users who are not yet customers
        List<Customer> usersAsCustomers = users.stream()
                .filter(user -> customers.stream().noneMatch(c -> c.getEmail().equals(user.getEmail())))
                .map(user -> {
                    Customer c = new Customer();
                    c.setName(user.getName());
                    c.setEmail(user.getEmail());
                    c.setPhone(user.getPhone());
                    c.setAddress(user.getAddress());
                    return c;
                })
                .collect(Collectors.toList());

        List<Customer> all = new ArrayList<>(customers);
        all.addAll(usersAsCustomers);

        return all.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @PostMapping
    public CustomerDTO createCustomer(@RequestBody CustomerDTO dto) {
        Customer saved = customerService.addCustomer(toEntity(dto));
        return toDTO(saved);
    }

    @PutMapping("/{email}")
    public CustomerDTO updateCustomer(@PathVariable String email, @RequestBody CustomerDTO dto) {
        Customer updated = customerService.updateCustomer(email, toEntity(dto));
        return toDTO(updated);
    }
    @Transactional

    @DeleteMapping("/{email}")
    public void deleteCustomer(@PathVariable String email) {
        customerService.deleteCustomer(email);

    }
}
