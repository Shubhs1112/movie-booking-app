using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Admin_Management_API.Models
{
    public class Movie
    {
        public int MovieId { get; set; }

        [Required]
        public string MovieName { get; set; } = null!;

        [Required]
        public string MovieDescription { get; set; } = null!;

        public TimeOnly MovieDuration { get; set; }  

        public DateOnly MovieReleaseDate { get; set; }  

        [Required]
        public string MovieLanguage { get; set; } = null!;

        [Required]
        [Column("movie_poster")]
        public string MoviePoster { get; set; }

        [Required]
        [Column("movie_genre")]
        public string MovieGenre { get; set; }

        public virtual ICollection<Show> Shows { get; set; } = new List<Show>(); // Optional
    }
}
