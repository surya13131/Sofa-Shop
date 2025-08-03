package com.goodwill.goodwill.Service;

import com.goodwill.goodwill.dto.LoginRequestDto;
import com.goodwill.goodwill.dto.RegisterRequestDto;
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

        return userRepository.save(user);
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    public User loginUser(LoginRequestDto request) {
        Optional<User> optional = Optional.empty();

        // Login with email or phone
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            optional = userRepository.findByEmailAndPassword(request.getEmail(), request.getPassword());
        } else if (request.getPhone() != null && !request.getPhone().isEmpty()) {
            optional = userRepository.findByPhoneAndPassword(request.getPhone(), request.getPassword());
        }

        return optional.orElseThrow(() -> new RuntimeException("Invalid email/phone or password"));
    }
}
