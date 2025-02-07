using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Admin_Management_API.Models;

public partial class Show
{
    public int ShowId { get; set; }

    public int MovieId { get; set; }

    public int ScreenId { get; set; }

    public DateTime ShowDate { get; set; }

    public TimeSpan ShowTime { get; set; }

    [Column("show_end_date")]
    public DateTime ShowEndDate { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual Movie Movie { get; set; } = null!;

    public virtual Screen Screen { get; set; } = null!;
}
