package com.bookkaro.Book.Karo.Movie.Booking.App.repository;
import com.bookkaro.Book.Karo.Movie.Booking.App.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByRoleName(String roleName); 
}
