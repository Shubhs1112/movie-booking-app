package com.bookkaro.Book.Karo.Movie.Booking.App.controller;
import com.bookkaro.Book.Karo.Movie.Booking.App.Models.LoginRequest;
import com.bookkaro.Book.Karo.Movie.Booking.App.Models.RegisterRequest;
import com.bookkaro.Book.Karo.Movie.Booking.App.Models.UpdateUserRequest;
import com.bookkaro.Book.Karo.Movie.Booking.App.entities.User;
import com.bookkaro.Book.Karo.Movie.Booking.App.service.UserService;
import com.bookkaro.Book.Karo.Movie.Booking.App.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth") 
public class UserController {

	@Autowired
	UserService userService;

	@PostMapping("/register")
	public ResponseEntity<Map<String, String>> registerUser(@RequestBody RegisterRequest registerRequest) {
		Map<String, String> response = new HashMap<>();
		try {
			// Validate incoming request
			String username = registerRequest.getUsername();
			String password = registerRequest.getPassword();
			String role = registerRequest.getRole();
			String first_name = registerRequest.getFirst_name();
			String last_name = registerRequest.getLast_name();
			String email = registerRequest.getEmail();
			String phone = registerRequest.getPhone();

			// Check if user already exists
			if (userService.doesUserExist(username)) {
				response.put("error", "Username Already Exists");
				return ResponseEntity.badRequest().body(response);
			}

			// Register user
			User user = userService.registerUser(username, password, role, first_name, last_name, email, phone);

			// Success response
			response.put("message", "User Registered Successfully");
			response.put("username", user.getUsername());
			return ResponseEntity.ok(response);

		} catch (IllegalArgumentException e) {
			// Handle known exceptions
			response.put("error", e.getMessage());
			return ResponseEntity.badRequest().body(response);

		} catch (RuntimeException e) {
			// Catch-all for unexpected errors
			response.put("error", "An unexpected error occurred during registration.");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	// User Login
	@PostMapping("/login")
	public ResponseEntity<Map<String, String>> loginUser(@RequestBody LoginRequest loginRequest) {
		try {
			String username = loginRequest.getUsername();
			String password = loginRequest.getPassword();

			User user = userService.loginUser(username, password);

			// Return a JSON response
			Map<String, String> response = new HashMap<>();
			response.put("message", "Login Successful");
			response.put("username", user.getUsername());
			response.put("firstname", user.getFirst_name());
			response.put("role", user.getRole().getRoleName());

			return ResponseEntity.ok(response);
		} catch (RuntimeException e) {
			return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
		}
	}

	/**
	 * Fetch a user by username
	 */
	@GetMapping("/{username}")
	public ResponseEntity<?> getUser(@PathVariable String username) {
		try {
			User user = userService.findUserByUsername(username);
			if (user == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
			}
			return ResponseEntity.ok(user);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("error", "An error occurred while fetching the user."));
		}
	}

	/**
	 * Update a user's information
	 */
	@PutMapping("/{username}")
	public ResponseEntity<Map<String, String>> updateUser(@PathVariable String username,
			@RequestBody UpdateUserRequest updateUserRequest) {

		Map<String, String> response = new HashMap<>();
		try {
			// Update user details
			User updatedUser = userService.updateUser(username, updateUserRequest.getFirst_name(),
					updateUserRequest.getLast_name(), updateUserRequest.getEmail(), updateUserRequest.getPhone());

			response.put("message", "User updated successfully");
			response.put("username", updatedUser.getUsername());
			return ResponseEntity.ok(response);
		} catch (IllegalArgumentException e) {
			// Handle known exceptions
			response.put("error", e.getMessage());
			return ResponseEntity.badRequest().body(response);
		} catch (RuntimeException e) {
			// Handle unexpected exceptions
			response.put("error", "An unexpected error occurred while updating the user.");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

}
