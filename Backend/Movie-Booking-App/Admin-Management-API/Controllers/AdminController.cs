using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Admin_Management_API.Models;
using Admin_Management_API.Models.Admin_Management_API.Models;

namespace Admin_Management_API.Controllers
{
    [Route("management/[controller]")]
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
                    MovieTrailer = movieDto.MovieTrailer,
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
                movie.MovieTrailer = movieDto.MovieTrailer;
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
                ShowEndDate = showDto.ShowEndDate,
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

        //Get Show by ID
        [HttpGet("show/{id}")]
        public async Task<IActionResult> GetShowById(int id)
        {
            var show = await _context.Shows
                .Where(s => s.ShowId == id)
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
                .FirstOrDefaultAsync();

            if (show == null)
            {
                return NotFound(new { message = "Show not found" });
            }

            return Ok(show);
        }

        //Update Current show
        [HttpPut("update-show/{id}")]
        public async Task<IActionResult> UpdateShow(int id, [FromBody] ShowDTO showDto)
        {
            // Validate that the ShowTime is in the correct format
            if (!TimeSpan.TryParse(showDto.ShowTime, out var showTime))
            {
                return BadRequest(new { message = "Invalid show time format" });
            }

            // Find the existing show by ID
            var existingShow = await _context.Shows.FindAsync(id);
            if (existingShow == null)
            {
                return NotFound(new { message = "Show not found" });
            }

            // Update only the allowed fields
            existingShow.ShowDate = showDto.ShowDate;
            existingShow.ShowEndDate = string.IsNullOrWhiteSpace(showDto.ShowEndDate?.ToString())
                ? null
                : showDto.ShowEndDate;
            existingShow.ShowTime = showTime;  // Convert to TimeSpan
            existingShow.ScreenId = showDto.ScreenId;

            // Save changes to the database
            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Show updated successfully!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error updating show: {ex.Message}" });
            }
        }

        //Delete a Show by ID
        [HttpDelete("delete-show/{id}")]
        public async Task<IActionResult> DeleteShow(int id)
        {
            // Find the existing show by ID
            var existingShow = await _context.Shows.FindAsync(id);
            if (existingShow == null)
            {
                return NotFound(new { message = "Show not found" });
            }

            // Remove the show from the database
            _context.Shows.Remove(existingShow);

            // Save changes to the database
            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Show deleted successfully!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error deleting show: {ex.Message}" });
            }
        }

        //Get All customers
        [HttpGet("customers")]
        public async Task<ActionResult<IEnumerable<User>>> GetCustomers()
        {
            var customers = await _context.Users
                .Where(u => u.Role.RoleName == "Customer") // Filtering users with role "Customer"
                .ToListAsync();

            return customers;
        }

        //Get all reviews 
        [HttpGet("GetReviewsWithUsers")]
        public async Task<ActionResult<IEnumerable<object>>> GetReviewsWithUsers()
        {
            var reviews = await _context.Reviews
                .Include(r => r.User)  // Load User details
                .Include(r => r.Movie) // Load Movie details
                .Select(r => new
                {
                    r.ReviewId,
                    r.ReviewMsg,
                    r.Rating,
                    r.MovieId,
                    r.UserId,
                    MovieName = r.Movie.MovieName, // Include the movie name in the response
                    User = new
                    {
                        r.User.UserId,
                        r.User.Username,  // Assuming User model has UserName
                        r.User.Email      // Assuming User model has Email
                    }
                })
                .ToListAsync();

            return Ok(reviews);
        }

        // GET reviews by ID {movieId}
        [HttpGet("GetReviewsByMovieId/{movieId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetReviewsByMovieId(int movieId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.MovieId == movieId)  // Filter by MovieId
                .Include(r => r.User)  // Load User details
                .Include(r => r.Movie) // Load Movie details
                .Select(r => new
                {
                    r.ReviewId,
                    r.ReviewMsg,
                    r.Rating,
                    r.MovieId,
                    MovieName = r.Movie.MovieName, // Include Movie Name
                    User = new
                    {
                        r.User.UserId,
                        r.User.Username,  // Assuming User model has Username
                        r.User.Email      // Assuming User model has Email
                    }
                })
                .ToListAsync();

            if (!reviews.Any())
            {
                return NotFound(new { Message = "No reviews found for this movie." });
            }

            return Ok(reviews);
        }

        
        //Get Movie by ID - required for movie name in Reviews 
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
                movie.MovieGenre,
                movie.MovieTrailer
            });
        }

        //Add review
        [HttpPost("reviews/add")]
        public async Task<ActionResult> AddReview(ReviewDto reviewDto)
        {
            // Validate required fields
            if (reviewDto.MovieId <= 0 || reviewDto.UserId <= 0 || reviewDto.Rating < 1 || reviewDto.Rating > 5)
            {
                return BadRequest(new { Message = "Invalid data. Ensure MovieId, UserId, and Rating (1-5) are valid." });
            }

            // Check if the movie exists
            var movieExists = await _context.Movies.AnyAsync(m => m.MovieId == reviewDto.MovieId);
            if (!movieExists)
            {
                return NotFound(new { Message = "Movie not found." });
            }

            // Check if the user exists
            var userExists = await _context.Users.AnyAsync(u => u.UserId == reviewDto.UserId);
            if (!userExists)
            {
                return NotFound(new { Message = "User not found." });
            }

            try
            {
                // Create a new Review entity from DTO
                var review = new Review
                {
                    ReviewMsg = reviewDto.ReviewMsg,
                    Rating = reviewDto.Rating,
                    MovieId = reviewDto.MovieId,
                    UserId = reviewDto.UserId
                };

                // Save to database
                _context.Reviews.Add(review);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Review added successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while adding the review.", Error = ex.Message });
            }
        }


        //Get Shows by MovieID 
        [HttpGet("current-shows/{movieId}")]
        public async Task<IActionResult> GetShowsByMovieId(int movieId)
        {
            var currentDate = DateOnly.FromDateTime(DateTime.Today);

            var shows = await _context.Shows
                .Where(s => s.MovieId == movieId && s.ShowDate.Date >= DateTime.Today) // Fetch only current & upcoming shows
                .Include(s => s.Movie)
                .Include(s => s.Screen)
                .Select(s => new
                {
                    s.ShowId,
                    s.ShowDate,
                    s.ShowEndDate,
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

            if (shows == null || !shows.Any())
            {
                return NotFound(new { message = "No current shows found for this movie." });
            }

            return Ok(shows);
        }

        // Report Generation
        [HttpGet("reports/detailed-shows")]
        public async Task<ActionResult<IEnumerable<DetailedShowReport>>> GetDetailedShowReport()
        {
            var report = await _context.Bookings
                .GroupBy(b => b.ShowId)
                .Select(g => new DetailedShowReport
                {
                    ShowId = g.Key,
                    ShowDate = g.FirstOrDefault().Show.ShowDate,
                    ShowTime = g.FirstOrDefault().Show.ShowTime,
                    MovieName = g.FirstOrDefault().Show.Movie.MovieName,
                    ScreenNumber = g.FirstOrDefault().Show.Screen.ScreenNumber,
                    TotalBookings = g.Count(),
                    TotalAmount = g.Sum(b => b.BookingAmount),
                    BookedUsers = g.Select(b => new UserReport
                    {
                        UserId = b.User.UserId,
                        Username = b.User.Username,
                        Email = b.User.Email,
                        Phone = b.User.Phone
                    }).ToList()
                })
                .ToListAsync();

            return Ok(report);
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