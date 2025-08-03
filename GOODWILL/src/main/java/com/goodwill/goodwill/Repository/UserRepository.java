package com.goodwill.goodwill.Repository;

import com.goodwill.goodwill.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    // Match by email AND password
    Optional<User> findByEmailAndPassword(String email, String password);

    // Match by phone AND password
    Optional<User> findByPhoneAndPassword(String phone, String password);

    // Check if email already exists (for registration)
    boolean existsByEmail(String email);

    // Optional: check if phone already exists
    boolean existsByPhone(String phone);
    void deleteByEmail(String email);
}
