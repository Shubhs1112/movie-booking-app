using System;
using System.Collections.Generic;

namespace Admin_Management_API.Models;

public partial class Movie
{
    public int MovieId { get; set; }

    public string MovieName { get; set; } = null!;

    public string MovieDescription { get; set; } = null!;

    public TimeOnly MovieDuration { get; set; }

    public DateOnly MovieReleaseDate { get; set; }

    public string MovieLanguage { get; set; } = null!;

    public virtual ICollection<Show> Shows { get; set; } = new List<Show>();
}
