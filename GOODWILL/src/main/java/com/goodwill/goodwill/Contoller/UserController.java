package com.goodwill.goodwill.Contoller;

import com.goodwill.goodwill.model.User;
import com.goodwill.goodwill.Service.UserService;
import com.goodwill.goodwill.dto.LoginRequestDto;
import com.goodwill.goodwill.dto.RegisterRequestDto;
import com.goodwill.goodwill.dto.ChangePasswordDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/users/register")
    public User registerUser(@RequestBody RegisterRequestDto request) {
        return userService.registerUser(request);
    }

    @PostMapping("/users/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequestDto request) {
        try {
            User user = userService.loginUser(request);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }


    @PostMapping("/admin/login")
    public ResponseEntity<?> loginAdmin(@RequestBody LoginRequestDto request) {
        try {
            User admin = userService.loginAdmin(request);  // role check inside
            return ResponseEntity.ok(admin);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body("Invalid admin credentials");
        }
    }

    // Register new admin
    @PostMapping("/admin/register")
    public ResponseEntity<?> registerAdmin(
            @RequestBody RegisterRequestDto request,
            @RequestParam String requesterEmail,
            @RequestParam String requesterPassword) {

        try {
            User newAdmin = userService.registerAdmin(requesterEmail, requesterPassword, request);
            return ResponseEntity.ok(newAdmin);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }


    @PostMapping("/admin/change-password")
    public ResponseEntity<?> changePassword (@RequestBody ChangePasswordDto dto) {
        try {
            userService.changePassword(dto);
            return ResponseEntity.ok("Password changed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}
