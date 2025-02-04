package com.bookkaro.Book.Karo.Movie.Booking.App.Models;
import lombok.Data;

@Data
public class UpdateUserRequest {
	private String first_name;
    private String last_name; 
    private String email;
    private String phone;
}
