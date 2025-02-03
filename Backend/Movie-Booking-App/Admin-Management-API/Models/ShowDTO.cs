using System.ComponentModel.DataAnnotations;

namespace Admin_Management_API.Models
{
    public class ShowDTO
    {
        public int MovieId { get; set; }
        public DateTime ShowDate { get; set; }
        public string ShowTime { get; set; }
        public int ScreenId { get; set; }
    }

}
