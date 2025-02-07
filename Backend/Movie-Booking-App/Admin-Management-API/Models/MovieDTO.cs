using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace Admin_Management_API.Models
{
    using Microsoft.AspNetCore.Http;
    using System;
    using System.ComponentModel.DataAnnotations;

    namespace Admin_Management_API.Models
    {
        public class MovieDTO
        {
            [Required]
            public string MovieName { get; set; } = null!;

            [Required]
            public string MovieDescription { get; set; } = null!;

            [Required]
            public string MovieDuration { get; set; } // Format: "HH:mm:ss"

            [Required]
            public string MovieReleaseDate { get; set; } // Format: "yyyy-MM-dd"

            [Required]
            public string MovieLanguage { get; set; } = null!;

            public IFormFile? PosterFile { get; set; } // Accepts image file (Multipart/Form-Data)

            public string? PosterUrl { get; set; } // Stores the image URL (if applicable)

            [Required]
            public string MovieGenre { get; set; } = null!;

            [Required]

            public string MovieTrailer { get; set; } = null;
        }
    }


}
