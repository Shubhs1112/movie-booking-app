import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Nav from './Nav';
import '../../resources/SeatBooking.css';

const SelectSeat = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { showId } = useParams();
    const navigate = useNavigate();

    
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const price = { standard: 150, gold: 250, recliner: 400 };

    useEffect(() => {
        const fetchSeats = async () => {
            try {
                console.log(`Fetching seats for showId: ${showId}`);
                const response = await fetch(`https://localhost:7042/api/Transaction/show/${showId}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch seats');
                }
                const data = await response.json();
                console.log("Fetched Data:", data);
    
                if (!data) {
                    throw new Error("Invalid data format received");
                }
    
                console.log("Raw Show Bookings:", data.showBookings);
    
                // Check if showBookings is an empty array, null, or a stringified array
                let bookedSeats = [];
                if (data.showBookings) {
                    try {
                        bookedSeats = JSON.parse(data.showBookings);
                        console.log("Parsed Booked Seats:", bookedSeats);
                    } catch (error) {
                        console.error("Error parsing showBookings:", error);
                    }
                }
    
                setSeats(createSeats(bookedSeats));
            } catch (err) {
                console.error("Fetch Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSeats();
    }, [showId]);
    
    

    
    function createSeats(bookings = []) {
        return [
            { type: 'Standard', rows: generateRows(0, 3, 10, 'standard', bookings) },
            { type: 'Gold', rows: generateRows(3, 5, 10, 'gold', bookings) },
            { type: 'Recliner', rows: generateRows(5, 7, 10, 'recliner', bookings) },
        ];
    }
    

    function generateRows(startRow, endRow, seatsPerRow, type, bookings) {
        return Array.from({ length: endRow - startRow }, (_, rowIndex) => 
            Array.from({ length: seatsPerRow }, (_, number) => {
                const seatId = `${String.fromCharCode(65 + startRow + rowIndex)}${number + 1}`;
                return {
                    id: seatId,
                    row: String.fromCharCode(65 + startRow + rowIndex),
                    number: number + 1,
                    type,
                    status: bookings.includes(seatId) ? 'booked' : 'available' // Check if booked
                };
            })
        );
    }

    const handleSeatClick = useCallback((seat) => {
        if (seat.status !== 'available') return;

        setSeats(prevSeats => 
            prevSeats.map(section => ({
                ...section,
                rows: section.rows.map(row => 
                    row.map(s => 
                        s.id === seat.id 
                            ? { ...s, status: s.status === 'selected' ? 'available' : 'selected' } 
                            : s
                    )
                )
            }))
        );

        setSelectedSeats(prev => 
            seat.status === 'selected' 
                ? prev.filter(s => s.id !== seat.id) 
                : [...prev, seat]
        );
    }, []);

    const calculateTotal = () => {
        return selectedSeats.reduce((total, seat) => total + price[seat.type], 0);
    };

    const handleConfirmBooking = () => {
        const totalAmount = calculateTotal();
        navigate(`/user/payment/${showId}`, { 
            state: { 
                showId, 
                selectedSeats: selectedSeats.map(seat => seat.id), 
                username: user.username,
                totalAmount
            } 
        });
    };
    

    return (
        <>
            <Nav isAuthenticated={isAuthenticated} user={user} />
            <div className="container mt-4 p-4 rounded shadow-lg" style={{ background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)" }}>
                <h2 className="fw-bold">Select Your Seats</h2>

                
                <div className="row">
                    {/* Seat Layout Section */}
                    <div className="col-md-7">
                        <div className="screen text-center my-3 p-1 bg-dark text-white rounded">Screen</div>
                        <div className="seats-layout">
                            {seats.map((section, sectionIndex) => (
                                <div key={sectionIndex} className="seat-section">
                                    <div className="seat-label" style={{ fontWeight: 'bold', marginBottom: '5px' }}>{section.type} - ₹{price[section.type.toLowerCase()]}</div>
                                    {section.rows.map((row, rowIndex) => (
                                        <div key={rowIndex} className="seat-row">
                                            {row.map(seat => (
                                                <button
                                                    key={seat.id}
                                                    className={`seat ${seat.type} ${seat.status}`}
                                                    onClick={() => handleSeatClick(seat)}
                                                    disabled={seat.status === 'booked'}
                                                    aria-label={`Seat ${seat.row}${seat.number}`}
                                                    style={{
                                                        backgroundColor: seat.type === 'standard' ? '#A0C4FF' : seat.type === 'gold' ? '#FFD700' : '#FF6B6B',
                                                        color: seat.status === 'booked' ? 'gray' : 'black',
                                                        fontWeight: seat.status === 'selected' ? 'bold' : 'normal',
                                                        border: seat.status === 'selected' ? '2px solid black' : '1px solid gray'
                                                    }}
                                                >
                                                    {seat.number}
                                                </button>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Booking Summary Section */}
                    <div className="col-md-4">
                        <div className="booking-summary mt-4">
                            <h4>Selected Seats:</h4>
                            <ul className="list-group">
                                {selectedSeats.map(seat => (
                                    <li key={seat.id} className="list-group-item">{seat.row}{seat.number} ({seat.type})</li>
                                ))}
                            </ul>
                            <h5 className="mt-3">Total: ₹{calculateTotal()}</h5>
                            <button className="btn btn-primary btn-lg mt-3" onClick={handleConfirmBooking} disabled={selectedSeats.length === 0}>
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SelectSeat;
