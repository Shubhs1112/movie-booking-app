import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CurrentShows = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);

    // Static backup movie posters
    const indianMovies = [
        'https://imgs.search.brave.com/RlpLca-c2qXAP2DEaD_xi1Xl-W2q-YelZ113OeAXIR4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHNjZG4xLnBheXRt/LmNvbS9pbWFnZXMv/Y2luZW1hL1Nvb2tz/aG1hZGFyc2hpbmkt/MmVhZjJmMDAtYTFi/NS0xMWVmLThiOTAt/NjdmMDc1ZDcyNWQ5/LmpwZz9mb3JtYXQ9/d2VicA',
        'https://imgs.search.brave.com/XKPvWUD57pM_7UJe8cKct1QXHfeUcv8n7HuJ0JnMryY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/MXNkYWJwNG50Mm0y/MS5qcGc_d2lkdGg9/NjQwJmNyb3A9c21h/cnQmYXV0bz13ZWJw/JnM9MWJjN2NlOGNj/NzQ4Mjc0OWRmYzk3/MTIyNGI2YTQ3MGIw/OWE0YzY0MA'
    ];

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(`https://localhost:7276/api/Admin/current-shows`);
                if (!response.ok) {
                    throw new Error('Failed to fetch movies');
                }
                const data = await response.json();

                // Remove duplicates based on movieName
                const uniqueMovies = new Map();
                data.forEach((show) => {
                    if (!uniqueMovies.has(show.movie.movieName)) {
                        uniqueMovies.set(show.movie.movieName, show);
                    }
                });
                setMovies([...uniqueMovies.values()]);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setError('Failed to fetch movie data');
            }
        };

        fetchMovies();
    }, []);

    // Handle Book Now Click
    const handleBookNow = (movieId) => {
        if (!isAuthenticated) {
            setShowPopup(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000); // Redirect to login after 3 seconds
        } else {
            navigate(`/user/book-movie/${movieId}`); // Redirect to BookMovie.jsx with movie ID
        }
    };

    return (
        <div className="container mb-5">
            <div className="row g-4 justify-content-center">
                {error ? (
                    indianMovies.map((poster, index) => (
                        <div className="col-6 col-md-2" key={index}>
                            <div className="card h-100 shadow-sm" id="poster">
                                <img 
                                    src={poster} 
                                    alt={`Bollywood Movie ${index + 1}`}
                                    className="card-img-top img-fluid movie-poster"
                                    style={{ height: '220px', objectFit: 'cover', padding: '5px' }} 
                                />
                                <div className="card-body p-2 text-center">
                                    <button className="btn btn-danger btn-sm w-100" onClick={() => handleBookNow(null)}>
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    movies.map((show, index) => {
                        const { movie } = show;
                        return (
                            <div className="col-6 col-md-2" key={index}>
                                <div className="card h-100 shadow-sm" id="poster">
                                    <img 
                                        src={movie.moviePoster}
                                        alt={movie.movieName || "Movie Poster"}
                                        className="card-img-top img-fluid movie-poster"
                                        style={{ height: '220px', objectFit: 'cover', padding: '5px' }} 
                                        onError={(e) => { e.target.onerror = null; e.target.src = indianMovies[index % indianMovies.length]; }} 
                                    />
                                    <div className="card-body p-2 text-center">
                                        <h6 className="text-truncate">{movie.movieName || "Unknown Movie"}</h6>
                                        <p className="small text-muted mb-1">{movie.movieGenre || "Genre Unavailable"}</p>
                                        <p className="small text-muted">{movie.movieLanguage || "Language Unavailable"}</p>
                                        <button className="btn btn-danger btn-sm w-100" onClick={() => handleBookNow(movie.movieId)}>
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Popup message */}
            {showPopup && (
                <div className="popup-container">
                    <div className="popup-message">
                        <p>Login to book movie</p>
                        <p>Redirecting to Login Page...</p>
                    </div>
                </div>
            )}

            {/* Popup styling */}
            <style>
                {`
                    .popup-container {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: rgba(0, 0, 0, 0.6); /* More translucent */
                        color: white;
                        padding: 20px 40px;
                        border-radius: 12px;
                        font-size: 20px;
                        z-index: 1000;
                        text-align: center; /* Centers the text */
                        backdrop-filter: blur(10px); /* Adds blur effect */
                        box-shadow: 0 4px 10px rgba(255, 255, 255, 0.2);
                        animation: fadeIn 0.3s ease-in-out;
                    }

                    /* Smooth fade-in effect */
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translate(-50%, -55%);
                        }
                        to {
                            opacity: 1;
                            transform: translate(-50%, -50%);
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default CurrentShows;
