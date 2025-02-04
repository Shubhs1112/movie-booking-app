package com.bookkaro.Book.Karo.Movie.Booking.App.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bookkaro.Book.Karo.Movie.Booking.App.entities.User;

public interface UserRepository extends JpaRepository<User, Integer> {
	
}
