using Admin_Management_API.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class Show
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ShowId { get; set; }

    [Required]
    public DateTime ShowDate { get; set; }

    [Required]
    public TimeSpan ShowTime { get; set; }

    [Required]
    public int MovieId { get; set; }

    public virtual Movie? Movie { get; set; }  // Make nullable

    [Required]
    public int ScreenId { get; set; }

    public virtual Screen? Screen { get; set; } // Make nullable

    public virtual ICollection<Booking>? Bookings { get; set; } = new List<Booking>();
}

