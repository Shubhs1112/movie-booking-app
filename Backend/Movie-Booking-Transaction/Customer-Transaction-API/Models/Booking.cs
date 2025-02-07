using System;
using System.Collections.Generic;

namespace Customer_Transaction_API.Models;

public partial class Booking
{
    public int BookingId { get; set; }

    public int ShowId { get; set; }

    public int UserId { get; set; }

    public DateTime BookingDate { get; set; }

    public TimeOnly BookingTime { get; set; }

    public decimal BookingAmount { get; set; }

    public int? CategoryId { get; set; }

    public string? SeatNumbers { get; set; }

    public virtual Category? Category { get; set; }

    public virtual Show Show { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
