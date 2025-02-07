using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Customer_Transaction_API.Models;
using Newtonsoft.Json;

namespace Customer_Transaction_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly P18MoviebookingsystemContext _context;

        public TransactionController(P18MoviebookingsystemContext context)
        {
            _context = context;
        }

        // GET: api/Transaction/show/{showId}
        [HttpGet("show/{showId}")]
        public async Task<ActionResult<Show>> GetShowById(int showId)
        {
            var show = await _context.Shows
                .Include(s => s.Movie)   // Include related Movie details
                .Include(s => s.Screen)  // Include related Screen details
                .Include(s => s.Bookings) // Include related Bookings
                .FirstOrDefaultAsync(s => s.ShowId == showId);

            if (show == null)
            {
                return NotFound(new { message = "Show not found" });
            }

            return Ok(show);
        }



        [HttpPost("book-show/{showId}")]
        public async Task<IActionResult> BookShow(int showId, [FromBody] BookingDTO bookingDto)
        {
            if (bookingDto == null)
            {
                return BadRequest(new { message = "Invalid request body" });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var existingShow = await _context.Shows.FindAsync(showId);
                if (existingShow == null)
                {
                    return NotFound(new { message = "Show not found" });
                }

                // ✅ Convert existing ShowBookings JSON to List<string> (Only seat numbers)
                List<string> bookedSeats =
                    string.IsNullOrEmpty(existingShow.ShowBookings)
                        ? new List<string>()
                        : JsonConvert.DeserializeObject<List<string>>(existingShow.ShowBookings) ?? new List<string>();

                // ✅ Generate new booking entry ID
                var newBookingEntry = $"B{Guid.NewGuid().ToString().Substring(0, 8)}";

                // ✅ Append new seats to ShowBookings list
                if (bookingDto.SeatNumbers != null)
                {
                    bookedSeats.AddRange(bookingDto.SeatNumbers);
                }

                // ✅ Convert updated list back to JSON format and update ShowBookings in Shows table
                existingShow.ShowBookings = JsonConvert.SerializeObject(bookedSeats);
                _context.Shows.Update(existingShow);

                // ✅ Convert SeatNumbers to JSON format (Key: BookingID, Value: List of Seats)
                var seatMapping = new Dictionary<string, List<string>> { { newBookingEntry, bookingDto.SeatNumbers ?? new List<string>() } };
                string seatNumbersJson = JsonConvert.SerializeObject(seatMapping);

                // ✅ Insert a single booking record
                var newBooking = new Booking
                {
                    ShowId = showId,
                    UserId = bookingDto.UserId,
                    CategoryId = bookingDto.CategoryId,
                    BookingDate = DateTime.UtcNow,
                    BookingTime = TimeOnly.FromDateTime(DateTime.UtcNow),
                    BookingAmount = bookingDto.BookingAmount,
                    SeatNumbers = seatNumbersJson
                };

                _context.Bookings.Add(newBooking);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Booking successful!", bookingId = newBookingEntry });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest(new { message = $"Error booking show: {ex.Message}" });
            }
        }


        //Fetch booking by username
        [HttpGet("bookings/user/{username}")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookingsByUsername(string username)
        {
            var user = await _context.Users
                .Include(u => u.Bookings)
                    .ThenInclude(b => b.Show)    // Include Show details
                        .ThenInclude(s => s.Movie) // Include Movie details
                .Include(u => u.Bookings)
                    .ThenInclude(b => b.Show)
                        .ThenInclude(s => s.Screen) // Include Screen details
                .FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(user.Bookings);
        }

    }
}
