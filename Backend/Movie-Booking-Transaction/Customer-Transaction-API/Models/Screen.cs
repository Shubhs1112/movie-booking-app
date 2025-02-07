using System;
using System.Collections.Generic;

namespace Customer_Transaction_API.Models;

public partial class Screen
{
    public int ScreenId { get; set; }

    public int ScreenNumber { get; set; }

    public string Description { get; set; } = null!;

    public int CategoryId { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();

    public virtual ICollection<Show> Shows { get; set; } = new List<Show>();
}
