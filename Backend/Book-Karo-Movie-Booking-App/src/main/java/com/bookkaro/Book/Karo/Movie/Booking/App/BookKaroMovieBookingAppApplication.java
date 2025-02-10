package com.bookkaro.Book.Karo.Movie.Booking.App;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class BookKaroMovieBookingAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(BookKaroMovieBookingAppApplication.class, args);
	}

}
