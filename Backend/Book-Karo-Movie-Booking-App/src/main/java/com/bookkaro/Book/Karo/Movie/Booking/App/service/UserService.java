package com.bookkaro.Book.Karo.Movie.Booking.App.service;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bookkaro.Book.Karo.Movie.Booking.App.entities.Role;
import com.bookkaro.Book.Karo.Movie.Booking.App.entities.User;
import com.bookkaro.Book.Karo.Movie.Booking.App.repository.UserRepository;

@Service
public class UserService {
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	RoleService roleService;
	
	public User save(User u) {
		return userRepository.save(u);
	}
	
	
	//User Exits ?
	public boolean doesUserExist(String username) { 
	    return userRepository.findAll().stream()
	            .anyMatch(u -> u.getUsername().equals(username));
	}

	//Register User
	public User registerUser(String username, String password, String roleType, String firstName, String lastName, String email, String phone) {
		//Check if User Already exists
		if(doesUserExist(username)) {
			throw new RuntimeException("Username already exists");
		} 
	    
		// Fetch the Role entity by role type
		Role role = roleService.getRoleByRoleName(roleType);
	    if (role == null) {
	        throw new RuntimeException("Invalid role type: " + roleType);
	    }
	    
	    
		//Create and Save User
		User user = new User();
		user.setUsername(username);
		user.setPassword(password);
		user.setFirst_name(firstName);
		user.setLast_name(lastName);
	    user.setEmail(email);
	    user.setPhone(phone);
		
		// Set Role (Role entity, not role_id)
        user.setRole(role);
		
		
		return userRepository.save(user);
	}
	
	// Login
	public User loginUser(String username, String password) {
		// Fetch the user by username
		User user = userRepository.findAll().stream().filter(u -> u.getUsername().equals(username)).findFirst()
				.orElseThrow(() -> new RuntimeException("Invalid username"));

		// Check the password
		if (!user.getPassword().equals(password)) {
			throw new RuntimeException("Invalid password");
		}

		return user;
	}


	public User findUserByUsername(String username) {
	    // Fetch user by username from the database
	    return userRepository.findAll().stream()
	            .filter(u -> u.getUsername().equals(username))
	            .findFirst()
	            .orElseThrow(() -> new RuntimeException("User not found"));
	}

	public User updateUser(String username, String firstName, String lastName, String email, String phone) {
	    User user = findUserByUsername(username);
	    
	    if (firstName != null) user.setFirst_name(firstName);
	    if (lastName != null) user.setLast_name(lastName);
	    if (email != null) user.setEmail(email);
	    if (phone != null) user.setPhone(phone);
	    
	    return userRepository.save(user); // Save updated user details
	}
}
