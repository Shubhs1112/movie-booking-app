namespace Customer_Transaction_API.Models
{
    public class BookingDTO
    {
        public int UserId { get; set; }  // ID of the user making the booking
        public int? CategoryId { get; set; }  // Category of the booking (optional)
        public decimal BookingAmount { get; set; }  // Total booking amount
        public List<string> SeatNumbers { get; set; } = new List<string>();  // List of seat numbers being booked
    }

}
