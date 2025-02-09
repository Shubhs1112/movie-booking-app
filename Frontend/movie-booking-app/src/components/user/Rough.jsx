import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CurrentShows = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
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

    const moviesPerPage = 4;
    const totalSlides = Math.ceil(movies.length / moviesPerPage);

    // Handle Next Slide
    const handleNext = () => {
        if (currentIndex < totalSlides - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };

    // Handle Previous Slide
    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };

    // Handle Book Now Click
    const handleBookNow = (movieId) => {
        if (!isAuthenticated) {
            setShowPopup(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } else {
            navigate(`/user/book-movie/${movieId}`);
        }
    };

    return (
        <div className="container mb-5">
            <div className="position-relative">
                {/* Left Button */}
                <button 
                    className="arrow-btn left-arrow" 
                    onClick={handlePrev} 
                    disabled={currentIndex === 0}
                >
                    &#9665;
                </button>

                <div className="carousel-container overflow-hidden">
                    <div
                        className="carousel-track d-flex"
                        style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: 'transform 0.5s ease-in-out' }}
                    >
                        {[...Array(totalSlides)].map((_, slideIndex) => (
                            <div className="carousel-slide w-100" key={slideIndex}>
                                <div className="row g-4 justify-content-center">
                                    {movies.slice(slideIndex * moviesPerPage, slideIndex * moviesPerPage + moviesPerPage).map((show, index) => (
                                        <div className="col-6 col-md-2" key={index}>
                                            <div className="card h-100 shadow-sm">
                                                <img 
                                                    src={show.movie.moviePoster}
                                                    alt={show.movie.movieName || "Movie Poster"}
                                                    className="card-img-top img-fluid movie-poster"
                                                    style={{ height: '220px', objectFit: 'cover', padding: '5px' }}
                                                    onError={(e) => { e.target.onerror = null; e.target.src = indianMovies[index % indianMovies.length]; }}
                                                />
                                                <div className="card-body p-2 text-center">
                                                    <h6 className="text-truncate">{show.movie.movieName || "Unknown Movie"}</h6>
                                                    <p className="small text-muted mb-1">{show.movie.movieGenre || "Genre Unavailable"}</p>
                                                    <p className="small text-muted">{show.movie.movieLanguage || "Language Unavailable"}</p>
                                                    <button className="btn btn-danger btn-sm w-100" onClick={() => handleBookNow(show.movie.movieId)}>
                                                        Book Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Button */}
                <button 
                    className="arrow-btn right-arrow" 
                    onClick={handleNext} 
                    disabled={currentIndex === totalSlides - 1}
                >
                    &#9655;
                </button>
            </div>

            {/* Popup Message */}
            {showPopup && (
                <div className="popup-container">
                    <div className="popup-message">
                        <p>Login to book movie</p>
                        <p>Redirecting to Login Page...</p>
                    </div>
                </div>
            )}

            {/* Styling */}
            <style>
                {`
                    .carousel-container {
                        overflow: hidden;
                        position: relative;
                        width: 100%;
                    }
                    .carousel-track {
                        display: flex;
                        width: ${totalSlides * 100}%;
                        transition: transform 0.5s ease-in-out;
                    }
                    .carousel-slide {
                        min-width: ${100 / totalSlides}%;
                    }
                    .arrow-btn {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        background-color: transparent;
                        color: black;
                        border: none;
                        padding: 5px 10px;
                        font-size: 24px;
                        cursor: pointer;
                        z-index: 100;
                    }
                    .arrow-btn:hover {
                        color: red;
                    }
                    .left-arrow {
                        left: -30px;
                    }
                    .right-arrow {
                        right: -30px;
                    }
                    .arrow-btn:disabled {
                        color: grey;
                        cursor: not-allowed;
                    }
                `}
            </style>
        </div>
    );
};

export default CurrentShows;
