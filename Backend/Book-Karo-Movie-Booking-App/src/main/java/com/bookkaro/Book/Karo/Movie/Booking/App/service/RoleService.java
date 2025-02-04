package com.bookkaro.Book.Karo.Movie.Booking.App.service;
import com.bookkaro.Book.Karo.Movie.Booking.App.entities.Role;
import com.bookkaro.Book.Karo.Movie.Booking.App.repository.RoleRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;
    
    // Method to get role ID by role name
    public Role getRoleByRoleName(String role_name) {
        Role role = roleRepository.findByRoleName(role_name);
        if (role == null) {
            throw new RuntimeException("Role not found: " + role_name);
        }
        return role;
    }

}
