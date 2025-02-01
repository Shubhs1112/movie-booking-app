using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Admin_Management_API.Models;

namespace Admin_Management_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly P18MoviebookingsystemContext _context;

        public AdminController(P18MoviebookingsystemContext context)
        {
            _context = context;
        }

        // Movie Management

        [HttpGet("movies")]
        public async Task<ActionResult<IEnumerable<Movie>>> GetMovies()
        {
            return await _context.Movies.ToListAsync();
        }

        [HttpPost("movies")]
        public async Task<ActionResult<Movie>> PostMovie(Movie movie)
        {
            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMovies), new { id = movie.MovieId }, movie);
        }

        [HttpPut("movies/{id}")]
        public async Task<IActionResult> PutMovie(int id, Movie movie)
        {
            if (id != movie.MovieId)
            {
                return BadRequest();
            }

            _context.Entry(movie).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MovieExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        [HttpDelete("movies/{id}")]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null)
            {
                return NotFound();
            }

            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Showtime Management

        [HttpGet("showtimes")]
        public async Task<ActionResult<IEnumerable<Show>>> GetShowtimes()
        {
            return await _context.Shows.Include(s => s.Movie).Include(s => s.Screen).ToListAsync();
        }

        [HttpPost("showtimes")]
        public async Task<ActionResult<Show>> PostShowtime(Show show)
        {
            _context.Shows.Add(show);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetShowtimes), new { id = show.ShowId }, show);
        }

        [HttpDelete("showtimes/{id}")]
        public async Task<IActionResult> DeleteShowtime(int id)
        {
            var show = await _context.Shows.FindAsync(id);
            if (show == null)
            {
                return NotFound();
            }

            _context.Shows.Remove(show);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Seat Management

        [HttpGet("seats")]
        public async Task<ActionResult<IEnumerable<Seat>>> GetSeats()
        {
            return await _context.Seats.Include(s => s.Screen).ToListAsync();
        }

        [HttpPost("seats")]
        public async Task<ActionResult<Seat>> PostSeat(Seat seat)
        {
            _context.Seats.Add(seat);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSeats), new { id = seat.SeatId }, seat);
        }

        [HttpDelete("seats/{id}")]
        public async Task<IActionResult> DeleteSeat(int id)
        {
            var seat = await _context.Seats.FindAsync(id);
            if (seat == null)
            {
                return NotFound();
            }

            _context.Seats.Remove(seat);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // User Management

        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [HttpPost("users")]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUsers), new { id = user.UserId }, user);
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Booking Management

        [HttpGet("bookings")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookings()
        {
            var bookings = await _context.Bookings
                .Include(b => b.Show)
                .Include(b => b.Seat)
                .Include(b => b.User)
                .ToListAsync();

            return Ok(bookings);
        }

        [HttpPost("bookings")]
        public async Task<ActionResult<Booking>> PostBooking(Booking booking)
        {
            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBookings), new { id = booking.BookingId }, booking);
        }

        [HttpDelete("bookings/{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Report Generation

        [HttpGet("reports/bookings")]
        public async Task<ActionResult<IEnumerable<BookingReport>>> GetBookingReport()
        {
            var report = await _context.Bookings
                .GroupBy(b => b.ShowId)
                .Select(g => new BookingReport
                {
                    ShowId = g.Key,
                    TotalBookings = g.Count(),
                    TotalAmount = g.Sum(b => b.BookingAmount)
                }).ToListAsync();

            return Ok(report);
        }

        private bool MovieExists(int id) => _context.Movies.Any(e => e.MovieId == id);
        private bool ShowExists(int id) => _context.Shows.Any(e => e.ShowId == id);
        private bool SeatExists(int id) => _context.Seats.Any(e => e.SeatId == id);
        private bool UserExists(int id) => _context.Users.Any(e => e.UserId == id);
        private bool BookingExists(int id) => _context.Bookings.Any(e => e.BookingId == id);
    }

    public class BookingReport
    {
        public int ShowId { get; set; }
        public int TotalBookings { get; set; }
        public decimal TotalAmount { get; set; }
    }
}