package com.bookkaro.Book.Karo.Movie.Booking.App.controller;
import com.bookkaro.Book.Karo.Movie.Booking.App.entities.Role;
import com.bookkaro.Book.Karo.Movie.Booking.App.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RoleController {

    @Autowired
    RoleService roleService;
    
 
}
