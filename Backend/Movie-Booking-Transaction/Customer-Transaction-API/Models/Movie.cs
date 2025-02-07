using System;
using System.Collections.Generic;

namespace Customer_Transaction_API.Models;

public partial class Movie
{
    public int MovieId { get; set; }

    public string MovieName { get; set; } = null!;

    public string MovieDescription { get; set; } = null!;

    public TimeOnly MovieDuration { get; set; }

    public DateOnly MovieReleaseDate { get; set; }

    public string MovieLanguage { get; set; } = null!;

    public string MoviePoster { get; set; } = null!;

    public string MovieGenre { get; set; } = null!;

    public string MovieTrailer { get; set; } = null!;

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual ICollection<Show> Shows { get; set; } = new List<Show>();
}
