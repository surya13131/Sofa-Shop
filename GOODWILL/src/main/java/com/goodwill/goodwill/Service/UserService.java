package com.goodwill.goodwill.Service;

import com.goodwill.goodwill.dto.LoginRequestDto;
import com.goodwill.goodwill.dto.RegisterRequestDto;
import com.goodwill.goodwill.dto.ChangePasswordDto;
import com.goodwill.goodwill.model.User;
import com.goodwill.goodwill.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // USER REGISTRATION
    public User registerUser(RegisterRequestDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User already exists with email: " + request.getEmail());
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("User already exists with phone: " + request.getPhone());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(request.getPassword());
        user.setAddress(request.getAddress());
        user.setRole("USER");

        return userRepository.save(user);
    }

    // USER LOGIN
    public User loginUser(LoginRequestDto request) {
        Optional<User> optional = Optional.empty();

        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            optional = userRepository.findByEmailAndPassword(request.getEmail(), request.getPassword());
        } else if (request.getPhone() != null && !request.getPhone().isEmpty()) {
            optional = userRepository.findByPhoneAndPassword(request.getPhone(), request.getPassword());
        }

        return optional.orElseThrow(() -> new RuntimeException("Invalid email/phone or password"));
    }

    // ADMIN LOGIN (checks role after login)
    public User loginAdmin(LoginRequestDto request) {
        User user = loginUser(request);
        if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Unauthorized: Not an admin");
        }
        return user;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ADMIN REGISTRATION (by another admin)
    public User registerAdmin(String existingAdminEmail, String existingAdminPassword, RegisterRequestDto newAdminRequest) {
        // Verify existing admin
        Optional<User> adminOpt = userRepository.findByEmailAndPassword(existingAdminEmail, existingAdminPassword);
        if (adminOpt.isEmpty() || !"ADMIN".equalsIgnoreCase(adminOpt.get().getRole())) {
            throw new RuntimeException("Unauthorized: Only admins can create new admins.");
        }

        // Check if new admin email/phone already exists
        if (userRepository.existsByEmail(newAdminRequest.getEmail())) {
            throw new RuntimeException("Admin already exists with email: " + newAdminRequest.getEmail());
        }

        User admin = new User();
        admin.setName(newAdminRequest.getName());
        admin.setEmail(newAdminRequest.getEmail());
        admin.setPhone(newAdminRequest.getPhone());
        admin.setPassword(newAdminRequest.getPassword());
        admin.setAddress(newAdminRequest.getAddress());
        admin.setRole("ADMIN");

        return userRepository.save(admin);
    }

    // ADMIN PASSWORD CHANGE (renamed to changePassword)
    public void changePassword(ChangePasswordDto dto) {
        Optional<User> adminOpt = userRepository.findByEmail(dto.getEmail());
        if (adminOpt.isEmpty() || !"ADMIN".equalsIgnoreCase(adminOpt.get().getRole())) {
            throw new RuntimeException("Admin not found.");
        }

        User admin = adminOpt.get();
        if (!admin.getPassword().equals(dto.getCurrentPassword())) {
            throw new RuntimeException("Current password is incorrect.");
        }

        admin.setPassword(dto.getNewPassword());
        userRepository.save(admin);
    }
}
