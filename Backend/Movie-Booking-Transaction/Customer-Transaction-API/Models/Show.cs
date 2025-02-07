using System;
using System.Collections.Generic;

namespace Customer_Transaction_API.Models;

public partial class Show
{
    public int ShowId { get; set; }

    public int MovieId { get; set; }

    public int ScreenId { get; set; }

    public DateOnly ShowDate { get; set; }

    public TimeOnly ShowTime { get; set; }

    public DateOnly ShowEndDate { get; set; }

    public string? ShowBookings { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual Movie Movie { get; set; } = null!;

    public virtual Screen Screen { get; set; } = null!;
}
