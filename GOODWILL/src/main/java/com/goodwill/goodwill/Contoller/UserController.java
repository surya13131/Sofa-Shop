package com.goodwill.goodwill.Contoller;

import com.goodwill.goodwill.model.User;
import com.goodwill.goodwill.Service.UserService;
import com.goodwill.goodwill.dto.LoginRequestDto;
import com.goodwill.goodwill.dto.RegisterRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequestDto request) {
        return userService.registerUser(request);
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto request) {
        try {
            User user = userService.loginUser(request);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email/phone or password");
        }
    }

}
