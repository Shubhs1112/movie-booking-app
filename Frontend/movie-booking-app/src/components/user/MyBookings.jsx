import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Nav from './Nav';

const MyBookings = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('upcoming'); // Filter state

    useEffect(() => {
        if (!user) return;

        const fetchBookings = async () => {
            try {
                const response = await fetch(`https://localhost:7042/api/Transaction/bookings/user/${user}`);
                if (!response.ok) throw new Error('Failed to fetch bookings.');

                const data = await response.json();
                console.log("Bookings Data:", data); // Debugging Log
                setBookings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    const today = new Date().setHours(0, 0, 0, 0);

    const filteredBookings = bookings.filter(booking => {
        const showDate = new Date(booking.show?.showDate).setHours(0, 0, 0, 0);
        return filter === 'upcoming' ? showDate >= today : showDate < today;
    });

    return (
        <>
            <Nav isAuthenticated={isAuthenticated} user={user} />
            <div className="container mt-4 p-4 rounded shadow-lg" style={{ background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)" }}>
                <div className="d-flex justify-content-between align-items-center">
                    <h2 className="fw-bold">My Bookings</h2>
                    <select className="form-select w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="upcoming">Upcoming Shows</option>
                        <option value="past">Past Shows</option>
                    </select>
                </div>
                {loading && <h3 className="text-center mt-3">Loading bookings...</h3>}
                {error && <h3 className="text-center mt-3 text-danger">{error}</h3>}
                {!loading && !error && filteredBookings.length === 0 && <p className="text-center">No bookings found.</p>}
                {!loading && !error && filteredBookings.length > 0 && (
                    <div className="list-group">
                        {filteredBookings.map((booking, index) => (
                            <div key={index} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="fw-bold">{booking.show?.movie?.movieName || "Unknown Movie"}</h5>
                                    <p className="mb-1">
                                        Screen: {booking.show?.screen?.screenNumber || "N/A"} | Seats: 
                                        {Object.values(JSON.parse(booking.seatNumbers || "{}")).flat().join(', ')}
                                    </p>
                                    <p className="text-muted mb-0">
                                        Showtime: {booking.show?.showDate ? new Date(booking.show.showDate).toLocaleDateString() : "N/A"} {booking.show?.showTime || "N/A"}
                                    </p>
                                </div>
                                <span className="badge bg-success">₹{booking.bookingAmount}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default MyBookings;
