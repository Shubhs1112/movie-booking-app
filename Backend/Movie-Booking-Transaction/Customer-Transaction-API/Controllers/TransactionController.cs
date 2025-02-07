using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Customer_Transaction_API.Models;

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

    }
}
