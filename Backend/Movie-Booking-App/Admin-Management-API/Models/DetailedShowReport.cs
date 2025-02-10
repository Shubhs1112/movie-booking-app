namespace Admin_Management_API.Models
{
    public class DetailedShowReport
    {
        public int ShowId { get; set; }
        public DateTime ShowDate { get; set; }
        public TimeSpan ShowTime { get; set; }

        public string MovieName { get; set; } = null!;
        public int ScreenNumber { get; set; }
        public int TotalBookings { get; set; }
        public decimal TotalAmount { get; set; }
        public List<UserReport> BookedUsers { get; set; } = new();
    }
}
