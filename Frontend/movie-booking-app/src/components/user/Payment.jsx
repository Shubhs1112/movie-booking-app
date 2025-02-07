import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Nav from './Nav';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { showId, selectedSeats, totalAmount } = location.state || {};

    const [paymentMethod, setPaymentMethod] = useState('');
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [otp, setOtp] = useState('');
    const [bookingDetails, setBookingDetails] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`https://localhost:7042/api/Transaction/show/${showId}`)
            .then(response => response.json())
            .then(data => setBookingDetails(data))
            .catch(error => console.error("Error fetching booking details:", error));

        fetch(`https://localhost:7042/api/User/by-username/${user}`)
            .then(response => response.json())
            .then(data => setUserInfo(data))
            .catch(error => console.error("Error fetching user information:", error));
    }, [showId, user]);

    if (!selectedSeats || !bookingDetails || !userInfo) {
        return <h3 className="text-center mt-5">Loading booking details...</h3>;
    }

    const handlePayment = async () => {
        if (!paymentMethod) {
            alert("Please select a payment method.");
            return;
        }
        if (paymentMethod === "UPI" && !upiId) {
            alert("Please enter your UPI ID.");
            return;
        }
        if ((paymentMethod === "Credit Card" || paymentMethod === "Debit Card") && (!cardNumber || !cardName || !otp)) {
            alert("Please enter all card details and OTP.");
            return;
        }

        setLoading(true);

        const bookingData = {
            userId: Number(userInfo.userId), 
            bookingAmount: parseFloat(totalAmount).toFixed(2), 
            seatNumbers: selectedSeats.map(seat => String(seat)) 
        };

        try {
            const response = await fetch(`https://localhost:7042/api/Transaction/book-show/${showId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingData),
            });
            console.log("Booking Payload:", JSON.stringify(bookingData, null, 2));

            const result = await response.json();

            if (response.ok && result.message === "Booking successful!") {
                alert("Payment Successful!");

                navigate('/user/booking-confirmed', {
                    state: {
                        showId: bookingDetails.showId,
                        selectedSeats,
                        totalAmount,
                        movieName: bookingDetails.movie.movieName,
                        screenNumber: bookingDetails.screen.screenNumber,
                        description: bookingDetails.screen.description,
                        showDate: bookingDetails.showDate,
                        showTime: bookingDetails.showTime,
                        bookingId: result.bookingId,
                    }
                });
            } else {
                alert(`Payment failed! ${result.message || "Please try again."}`);
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("Payment failed! Something went wrong.");
        }

        setLoading(false);
    };

    return (
        <>
            <Nav isAuthenticated={isAuthenticated} user={user} />
            <div className="container mt-4 p-4 rounded shadow-lg" style={{ background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)" }}>
                <h2 className="fw-bold">Payment</h2>
                <div className="row">
                    <div className="col-md-6">
                        <div className="card p-4">
                            <h4>Select Payment Method</h4>
                            <div className="form-check mt-2">
                                <input type="radio" id="credit-card" name="payment" className="form-check-input" value="Credit Card" onChange={(e) => setPaymentMethod(e.target.value)} />
                                <label htmlFor="credit-card" className="form-check-label">Credit Card</label>
                            </div>
                            <div className="form-check mt-2">
                                <input type="radio" id="debit-card" name="payment" className="form-check-input" value="Debit Card" onChange={(e) => setPaymentMethod(e.target.value)} />
                                <label htmlFor="debit-card" className="form-check-label">Debit Card</label>
                            </div>
                            <div className="form-check mt-2">
                                <input type="radio" id="upi" name="payment" className="form-check-input" value="UPI" onChange={(e) => setPaymentMethod(e.target.value)} />
                                <label htmlFor="upi" className="form-check-label">UPI</label>
                            </div>
                            {(paymentMethod === "UPI") && (
                                <div className="mt-3">
                                    <label className="form-label">Enter UPI ID</label>
                                    <input type="text" className="form-control" placeholder="example@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                                </div>
                            )}
                            {(paymentMethod === "Credit Card" || paymentMethod === "Debit Card") && (
                                <div className="mt-3">
                                    <label className="form-label">Card Number</label>
                                    <input type="text" className="form-control" placeholder="1234 5678 9101 1121" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                                    <label className="form-label mt-2">Cardholder Name</label>
                                    <input type="text" className="form-control" placeholder="Full Name" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                                    <label className="form-label mt-2">Enter OTP</label>
                                    <input type="password" className="form-control" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card p-4">
                            <h4>Booking Summary</h4>
                            <p><strong>Movie Name:</strong> {bookingDetails.movie.movieName}</p>
                            <p><strong>Screen Number:</strong> {bookingDetails.screen.screenNumber}</p>
                            <p><strong>Screen Description:</strong> {bookingDetails.screen.description}</p>
                            <p><strong>Selected Seats:</strong> {selectedSeats.join(', ')}</p>
                            <p><strong>Date & Time of Show:</strong> {bookingDetails.showDate} {bookingDetails.showTime}</p>
                            <p><strong>Total Amount:</strong> ₹{totalAmount}</p>
                            <button className="btn btn-success btn-lg mt-3" onClick={handlePayment} disabled={loading}>{loading ? "Processing..." : "Proceed to Pay"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Payment;
