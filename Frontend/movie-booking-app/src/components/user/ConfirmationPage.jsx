import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Nav from './Nav';

const ConfirmationPage = () => {
    const location = useLocation();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { showId, selectedSeats, totalAmount, movieName, screenNumber, description, showDate, showTime, bookingId } = location.state || {};

    return (
        <>
        <Nav isAuthenticated={isAuthenticated} user={user} />
        <div className="container mt-5 p-4 rounded shadow-lg" style={{ background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)" }}>
            <h2 className="text-center fw-bold">Booking Confirmation</h2>
            <div className="card p-4 mt-4">
                <h4 className="fw-bold">Booking Details</h4>
                <p><strong>Movie:</strong> {movieName}</p>
                <p><strong>Screen:</strong> {screenNumber} - {description}</p>
                <p><strong>Show Date & Time:</strong> {showDate} {showTime}</p>
                <p><strong>Selected Seats:</strong> {selectedSeats.join(', ')}</p>
                <p><strong>Total Paid:</strong> ₹{totalAmount}</p>

                {bookingId ? (
                    <div className="alert alert-success mt-3 text-center">
                        <h4>Booking Confirmed!</h4>
                        <p>Booking Id : {bookingId.toUpperCase()}</p>
                    </div>
                ) : (
                    <div className="alert alert-info text-center mt-3">Processing your booking...</div>
                )}
                
            </div>
        </div>
        </>
    );
};

export default ConfirmationPage;
