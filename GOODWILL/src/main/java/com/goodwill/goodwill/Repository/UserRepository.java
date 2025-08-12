package com.goodwill.goodwill.Repository;

import com.goodwill.goodwill.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmailAndPassword(String email, String password);

    Optional<User> findByPhoneAndPassword(String phone, String password);

    Optional<User> findByEmail(String email);  // <---- Add this

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    void deleteByEmail(String email);
}
