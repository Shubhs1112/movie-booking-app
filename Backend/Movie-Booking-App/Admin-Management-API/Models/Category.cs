using System;
using System.Collections.Generic;

namespace Admin_Management_API.Models;

public partial class Category
{
    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public decimal Price { get; set; }

    public int? MaxSeats { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual ICollection<Screen> Screens { get; set; } = new List<Screen>();
}
