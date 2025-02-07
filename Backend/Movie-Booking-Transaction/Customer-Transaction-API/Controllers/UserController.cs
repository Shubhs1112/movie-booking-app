using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Customer_Transaction_API.Models;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly P18MoviebookingsystemContext _context;

    public UserController(P18MoviebookingsystemContext context)
    {
        _context = context;
    }

    // GET: api/User/by-username/{username}
    [HttpGet("by-username/{username}")]
    public async Task<IActionResult> GetUserByUsername(string username)
    {
        if (string.IsNullOrWhiteSpace(username))
        {
            return BadRequest("Username cannot be empty.");
        }

        var user = await _context.Users
            .Include(u => u.Role)
            .Include(u => u.Bookings)
            .Include(u => u.Reviews)
            .FirstOrDefaultAsync(u => u.Username == username);

        if (user == null)
        {
            return NotFound($"User with username '{username}' not found.");
        }

        return Ok(user);
    }
}
