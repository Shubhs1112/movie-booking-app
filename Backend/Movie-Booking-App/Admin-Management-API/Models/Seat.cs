using System;
using System.Collections.Generic;

namespace Admin_Management_API.Models;

public partial class Seat
{
    public int SeatId { get; set; }

    public int ScreenId { get; set; }

    public string? Row { get; set; }

    public int? Column { get; set; }

    public bool? IsAvailable { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual Screen Screen { get; set; } = null!;
}
