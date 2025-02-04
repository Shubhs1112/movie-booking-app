package com.bookkaro.Book.Karo.Movie.Booking.App.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="user")
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int user_id;
	private String username;
	private String password;
	private String first_name;
    private String last_name;
    private String email;
    private String phone;
	
	@ManyToOne
	@JsonIgnoreProperties("users")
    @JoinColumn(name = "role_id")
    private Role role;

}
