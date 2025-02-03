using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Admin_Management_API.Models;
using Admin_Management_API.Models.Admin_Management_API.Models;

namespace Admin_Management_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly P18MoviebookingsystemContext _context;
        private readonly string _posterDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "posters");

        public AdminController(P18MoviebookingsystemContext context)
        {
            _context = context;
            if (!Directory.Exists(_posterDirectory))
            {
                Directory.CreateDirectory(_posterDirectory);
            }
        }

        // Get All movies
        [HttpGet("movies")]
        public async Task<ActionResult<IEnumerable<Movie>>> GetMovies()
        {
            return await _context.Movies.ToListAsync();
        }

        //Add-Movie
        [HttpPost("add-movie")]
        public async Task<IActionResult> PostMovie([FromForm] MovieDTO movieDto) // Accepts Form-Data
        {
            if (movieDto == null)
            {
                return BadRequest("Invalid movie data.");
            }

            try
            {
                string? posterPath = null;

                // Handle File Upload
                if (movieDto.PosterFile != null)
                {
                    var uploadsFolder = Path.Combine("wwwroot", "uploads");
                    Directory.CreateDirectory(uploadsFolder); // Ensure the folder exists

                    string uniqueFileName = $"{Guid.NewGuid()}_{movieDto.PosterFile.FileName}";
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await movieDto.PosterFile.CopyToAsync(stream);
                    }

                    posterPath = $"/uploads/{uniqueFileName}"; // Relative path for storing in DB
                }
                else if (!string.IsNullOrEmpty(movieDto.PosterUrl))
                {
                    posterPath = movieDto.PosterUrl; // Use the provided URL
                }

                var movie = new Movie
                {
                    MovieName = movieDto.MovieName,
                    MovieDescription = movieDto.MovieDescription,
                    MovieDuration = TimeOnly.Parse(movieDto.MovieDuration),
                    MovieReleaseDate = DateOnly.Parse(movieDto.MovieReleaseDate),
                    MovieLanguage = movieDto.MovieLanguage,
                    MovieGenre = movieDto.MovieGenre,
                    MoviePoster = posterPath // Save either uploaded file path or URL
                };

                _context.Movies.Add(movie);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetMovie), new { id = movie.MovieId }, movie);
            }
            catch (FormatException ex)
            {
                return BadRequest($"Invalid Date/Time format: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.InnerException?.Message ?? ex.Message}");
            }
        }

        //Add Show
        [HttpPost("add-show")]
        public async Task<IActionResult> PostShow([FromBody] ShowDTO showDto)
        {
            // Validate that the ShowTime is in the correct format
            if (!TimeSpan.TryParse(showDto.ShowTime, out var showTime))
            {
                return BadRequest(new { message = "Invalid show time format" });
            }

            // Create a new Show object using the validated data from the DTO
            var show = new Show
            {
                ShowDate = showDto.ShowDate,
                ShowTime = showTime,  // Now this is of type TimeSpan
                MovieId = showDto.MovieId,
                ScreenId = showDto.ScreenId
            };

            // Save the show object to the database (assuming _context is your DbContext)
            try
            {
                _context.Shows.Add(show);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Show added successfully!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error adding show: {ex.Message}" });
            }
        }

        //Get Current Shows 
        [HttpGet("current-shows")]
        public async Task<IActionResult> GetCurrentShows()
        {
            var today = DateTime.Today; // Keep it as DateTime to match EF Core behavior

            var shows = await _context.Shows
                .Where(s => s.ShowDate >= today && s.ShowTime >= TimeSpan.Zero) // Use TimeSpan.Zero if ShowTime is TimeSpan
                .Include(s => s.Movie)
                .Include(s => s.Screen)
                .Select(s => new
                {
                    s.ShowId,
                    s.ShowDate,
                    ShowTime = s.ShowTime.ToString(@"hh\:mm"), // Format TimeSpan as HH:mm
                    Movie = new
                    {
                        s.Movie.MovieId,
                        s.Movie.MovieName,
                        s.Movie.MovieDuration,
                        s.Movie.MovieDescription,
                        s.Movie.MovieLanguage,
                        s.Movie.MovieGenre,
                        MoviePoster = s.Movie.MoviePoster != null
                            ? $"{Request.Scheme}://{Request.Host}{s.Movie.MoviePoster}"
                            : null
                    },
                    Screen = new
                    {
                        s.Screen.ScreenId,
                        s.Screen.Description
                    }
                })
                .ToListAsync();

            return Ok(shows);
        }

        //Update Movie
        [HttpPut("update-movie/{id}")]
        public async Task<IActionResult> PutMovie(int id, [FromForm] MovieDTO movieDto)
        {
            if (movieDto == null)
            {
                return BadRequest("Invalid movie data.");
            }

            // Find the existing movie by ID
            var movie = await _context.Movies.FindAsync(id);

            if (movie == null)
            {
                return NotFound(); // Movie not found with the given ID
            }

            try
            {
                // Handle File Upload (if a new poster is uploaded)
                string? posterPath = movie.MoviePoster; // Keep the current poster path if no new file is uploaded

                if (movieDto.PosterFile != null)
                {
                    var uploadsFolder = Path.Combine("wwwroot", "uploads");
                    Directory.CreateDirectory(uploadsFolder); // Ensure the folder exists

                    string uniqueFileName = $"{Guid.NewGuid()}_{movieDto.PosterFile.FileName}";
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await movieDto.PosterFile.CopyToAsync(stream);
                    }

                    posterPath = $"/uploads/{uniqueFileName}"; // New poster file path to be saved in DB
                }
                else if (!string.IsNullOrEmpty(movieDto.PosterUrl))
                {
                    posterPath = movieDto.PosterUrl; // If a new poster URL is provided, use it
                }

                // Update the movie properties
                movie.MovieName = movieDto.MovieName;
                movie.MovieDescription = movieDto.MovieDescription;
                movie.MovieDuration = TimeOnly.Parse(movieDto.MovieDuration); // Parse MovieDuration from string (HH:mm:ss)
                movie.MovieReleaseDate = DateOnly.Parse(movieDto.MovieReleaseDate); // Parse MovieReleaseDate from string (yyyy-MM-dd)
                movie.MovieLanguage = movieDto.MovieLanguage;
                movie.MovieGenre = movieDto.MovieGenre;
                movie.MoviePoster = posterPath; // Update the poster path (new or old)

                // Mark the entity as modified
                _context.Entry(movie).State = EntityState.Modified;

                // Save changes to the database
                await _context.SaveChangesAsync();

                return NoContent(); // Return HTTP 204 No Content (success)
            }
            catch (FormatException ex)
            {
                return BadRequest($"Invalid Date/Time format: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.InnerException?.Message ?? ex.Message}");
            }
        }






















        //[HttpGet("category")]
        //public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        //{
        //    return await _context.Categories.ToListAsync();
        //}

        [HttpGet("movies/{id}")]
        public async Task<IActionResult> GetMovie(int id)
        {
            var movie = await _context.Movies.FindAsync(id);

            if (movie == null)
            {
                return NotFound();
            }

            var imageUrl = movie.MoviePoster != null
                ? $"{Request.Scheme}://{Request.Host}{movie.MoviePoster}" // Full URL to the poster
                : null;

            return Ok(new
            {
                movie.MovieId,
                movie.MovieName,
                movie.MovieDescription,
                movie.MovieDuration,
                movie.MovieReleaseDate,
                movie.MovieLanguage,
                MoviePoster = imageUrl, // Full URL for the poster
                movie.MovieGenre
            });
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