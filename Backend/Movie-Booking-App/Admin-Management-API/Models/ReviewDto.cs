namespace Admin_Management_API.Models
{
    public class ReviewDto
    {
        public string ReviewMsg { get; set; } = string.Empty;
        public int Rating { get; set; }
        public int MovieId { get; set; }
        public int UserId { get; set; }
    }

}
