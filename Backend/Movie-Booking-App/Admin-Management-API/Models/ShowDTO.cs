using System.ComponentModel.DataAnnotations;

namespace Admin_Management_API.Models
{
    public class ShowDTO
    {
        [Required]
        public DateTime ShowDate { get; set; }

        [Required]
        public TimeSpan ShowTime { get; set; }

        [Required]
        public decimal ShowPrice { get; set; }

        [Required]
        public int ScreenId { get; set; }
    }

}
