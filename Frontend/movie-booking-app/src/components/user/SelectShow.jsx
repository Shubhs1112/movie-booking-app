import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Nav from './Nav';

const SelectShow = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { movieId } = useParams();
    const navigate = useNavigate();
    
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableDates, setAvailableDates] = useState([]);

    useEffect(() => {
        const fetchShows = async () => {
            try {
                const response = await fetch(`https://localhost:7276/api/Admin/current-shows/${movieId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch show details.');
                }
                const data = await response.json();
                setShows(data);

                // Extract unique show dates
                const dates = [...new Set(data.map(show => show.showDate))];
                
                setAvailableDates(dates);
                if (dates.length > 0) {
                    setSelectedDate(dates[0]);
                };
    
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchShows();
    }, [movieId]);
    
    const handleBookSeats = (showId) => {
        navigate(`/user/book-seats/${showId}`);
    };


    const filteredShows = shows.filter(show => show.showDate === selectedDate);


    return (
        <>
            <Nav isAuthenticated={isAuthenticated} user={user} />
            <div className="container mt-4 p-4 rounded shadow-lg"
                 style={{ background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)" }}
            >   
                {loading && <div className="text-center mt-3"><h3>Loading movie details...</h3></div>}
                {error && <div className="text-center mt-3 text-danger"><h3>{error}</h3></div>}
                <h2 className="fw-bold">{shows.length > 0 && `${shows[0].movie.movieName} - ${shows[0].movie.movieLanguage}`}</h2>

                <div className="mb-3">
                    <h5>Select Date:</h5>
                    <div className="d-flex flex-wrap">
                        {availableDates.map(date => (
                            <button 
                                key={date} 
                                className={`btn me-2 mb-2 ${selectedDate === date ? "btn-primary" : "btn-outline-primary"}`} 
                                onClick={() => setSelectedDate(date)}
                            >
                                {new Date(date).toDateString()}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredShows.length > 0 ? (
                    <div className="list-group">
                        {filteredShows.map(show => (
                            <div key={show.showId} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="mb-1"><strong>Show Time:</strong> {show.showTime}</p>
                                    <p className="mb-1"><strong>Screen Type:</strong> {show.screen.description}</p>
                                </div>
                                <button className="btn btn-danger btn-lg" onClick={() => handleBookSeats(show.showId)}>
                                    Book Now
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted">No shows available for the selected date.</p>
                )}

            </div>
        </>
    );
};

export default SelectShow;
