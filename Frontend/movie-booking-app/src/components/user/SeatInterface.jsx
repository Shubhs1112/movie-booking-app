import React, { useState, useCallback } from 'react';

const SeatBooking = () => {
  const [seats, setSeats] = useState(() => createSeats());
  const [selectedSeats, setSelectedSeats] = useState([]);

  const price = {
    standard: 10,
    vip: 20
  };

  function createSeats() {
    const rows = 8;
    const seatsPerRow = 10;
    const seatLayout = [];
    
    for (let row = 0; row < rows; row++) {
      const seatRow = [];
      for (let number = 1; number <= seatsPerRow; number++) {
        seatRow.push({
          id: `${String.fromCharCode(65 + row)}${number}`,
          row: String.fromCharCode(65 + row),
          number: number,
          type: row < 2 ? 'vip' : 'standard', // First 2 rows are VIP
          status: Math.random() < 0.2 ? 'booked' : 'available' // 20% chance of being booked
        });
      }
      seatLayout.push(seatRow);
    }
    return seatLayout;
  }

  const handleSeatClick = useCallback((seat) => {
    if (seat.status !== 'available') return;

    setSeats(prevSeats => 
      prevSeats.map(row => 
        row.map(s => 
          s.id === seat.id 
            ? {...s, status: s.status === 'selected' ? 'available' : 'selected'} 
            : s
        )
      )
    );

    setSelectedSeats(prev => 
      seat.status === 'selected' 
        ? prev.filter(s => s.id !== seat.id) 
        : [...prev, seat]
    );
  }, []);

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => 
      total + (seat.type === 'vip' ? price.vip : price.standard), 0);
  };

  return (
    <div className="seat-booking-container">
      <div className="screen">Screen</div>
      
      <div className="seats-layout">
        {seats.map((row, rowIndex) => (
          <div key={rowIndex} className="seat-row">
            {row.map(seat => (
              <button
                key={seat.id}
                className={`seat ${seat.type} ${seat.status}`}
                onClick={() => handleSeatClick(seat)}
                disabled={seat.status === 'booked'}
                aria-label={`Seat ${seat.row}${seat.number}`}
              >
                {seat.number}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="booking-summary">
        <h3>Selected Seats:</h3>
        <ul>
          {selectedSeats.map(seat => (
            <li key={seat.id}>{seat.row}{seat.number} ({seat.type})</li>
          ))}
        </ul>
        <div className="total-price">Total: ${calculateTotal()}</div>
      </div>
    </div>
  );
};

export default SeatBooking;