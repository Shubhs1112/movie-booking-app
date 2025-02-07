using System;
using System.Collections.Generic;

namespace Customer_Transaction_API.Models;

public partial class Review
{
    public int ReviewId { get; set; }

    public string? ReviewMsg { get; set; }

    public int Rating { get; set; }

    public int MovieId { get; set; }

    public int UserId { get; set; }

    public virtual Movie Movie { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
