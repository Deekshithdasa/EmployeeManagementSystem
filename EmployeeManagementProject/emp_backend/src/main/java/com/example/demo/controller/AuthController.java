package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    
    private static final Map<String, UserCredential> users = new HashMap<>();

    static {
        
        users.put("hr@company.com", new UserCredential("HRPass@2026!", "HR", "HR Manager"));
        users.put("admin@company.com", new UserCredential("AdminPass@2026!", "ADMIN", "Administrator"));
        users.put("hr@example.com", new UserCredential("hr123456", "HR", "HR Officer"));
        users.put("admin@example.com", new UserCredential("admin456", "ADMINISTRATION", "Admin Officer"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            String email = loginRequest.getEmail();
            String password = loginRequest.getPassword();

            
            if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
                return ResponseEntity.badRequest().body(new ErrorResponse("Email and password are required"));
            }

            
            UserCredential user = users.get(email.toLowerCase());
            
            if (user == null || !user.getPassword().equals(password)) {
                return ResponseEntity.status(401).body(new ErrorResponse("Invalid email or password"));
            }

            
            if (!user.getRole().equals("HR") && !user.getRole().equals("ADMIN") && !user.getRole().equals("ADMINISTRATION")) {
                return ResponseEntity.status(403).body(new ErrorResponse("You do not have access. Only HR and Administration can access this application."));
            }

            
            LoginResponse response = new LoginResponse();
            response.setId(1);
            response.setEmail(email.toLowerCase());
            response.setRole(user.getRole());
            response.setName(user.getName());
            response.setToken("jwt-token-" + System.currentTimeMillis());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ErrorResponse("Server error: " + e.getMessage()));
        }
    }

    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        if (email == null || password == null || email.isEmpty() || password.isEmpty()) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Email and password are required"));
        }

        if (users.containsKey(email.toLowerCase())) {
            return ResponseEntity.badRequest().body(new ErrorResponse("User already exists"));
        }

        
        users.put(email.toLowerCase(), new UserCredential(password, "EMPLOYEE", "Employee"));

        LoginResponse response = new LoginResponse();
        response.setId(users.size());
        response.setEmail(email.toLowerCase());
        response.setRole("EMPLOYEE");
        response.setName("Employee");
        response.setToken("jwt-token-" + System.currentTimeMillis());

        return ResponseEntity.ok(response);
    }

    
    public static class LoginRequest {
        private String email;
        private String password;

        public LoginRequest() {}

        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class LoginResponse {
        private Integer id;
        private String email;
        private String role;
        private String name;
        private String token;

        public LoginResponse() {}

        public LoginResponse(Integer id, String email, String role, String name, String token) {
            this.id = id;
            this.email = email;
            this.role = role;
            this.name = name;
            this.token = token;
        }

        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }
    }

    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    
    private static class UserCredential {
        private String password;
        private String role;
        private String name;

        public UserCredential(String password, String role, String name) {
            this.password = password;
            this.role = role;
            this.name = name;
        }

        public String getPassword() {
            return password;
        }

        public String getRole() {
            return role;
        }

        public String getName() {
            return name;
        }
    }
}
