using System;
using System.Collections.Generic;

namespace Customer_Transaction_API.Models;

public partial class Seat
{
    public int SeatId { get; set; }

    public int ScreenId { get; set; }

    public string? Row { get; set; }

    public int? Column { get; set; }

    public bool? IsAvailable { get; set; }

    public virtual Screen Screen { get; set; } = null!;
}
