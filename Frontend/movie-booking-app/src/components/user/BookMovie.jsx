import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate} from 'react-router-dom';
import { FaStar, FaRegStar, FaPlay } from "react-icons/fa";
import Nav from './Nav';

const BookMovie = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { movieId } = useParams();
    const navigate = useNavigate();
    
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const [movieResponse, reviewsResponse] = await Promise.all([
                    fetch(`https://localhost:7276/api/Admin/movies/${movieId}`),
                    fetch(`https://localhost:7276/api/Admin/GetReviewsByMovieId/${movieId}`)
                ]);

                const movieData = await movieResponse.json();
                const reviewsData = await reviewsResponse.json();

                setMovie(movieData);
                setReviews(reviewsData); 
            } catch (err) {
                setError('Failed to fetch movie details or reviews.');
            } finally {
                setLoading(false);
            }
        };

        fetchMovieData();
    }, [movieId]);

    // Render Stars for reviews
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? <FaStar key={i} className="text-warning" /> : <FaRegStar key={i} className="text-secondary" />);
        }
        return stars;
    };

    // Function to extract YouTube video ID from URL
    const getYouTubeEmbedUrl = (url) => {
        const videoIdMatch = url?.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
    };

    //Scroll to Trailer
    const scrollToTrailer = () => {
        window.location.hash = '#watchtrailer';
        setTimeout(() => {
            const element = document.getElementById('watchtrailer');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 0);
    };

    //Handle Book Tickets
    const handleBookTickets = () => {
        navigate(`/user/select-show/${movieId}`); 
    };

    return (
        <>
            <Nav isAuthenticated={isAuthenticated} user={user} />

            <div className="container mt-4 p-4 rounded shadow-lg"
                 style={{ background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)" }}
            >
                {loading && <div className="text-center mt-3"><h3>Loading movie details...</h3></div>}
                {error && <div className="text-center mt-3 text-danger"><h3>{error}</h3></div>}

                {!loading && !error && (
                    <div className="row g-4">
                        <div className="col-md-4 d-flex justify-content-center">
                            <div className="card shadow-sm" 
                                 style={{ maxHeight: '460px'}}
                            >
                                <img 
                                    src={movie?.moviePoster || 'default-poster.jpg'} 
                                    alt={movie?.movieName || 'Movie Poster'} 
                                    className="card-img-top img-fluid" 
                                    style={{ maxHeight: '400px', objectFit: 'cover' }} 
                                />
                                <div className="card-body text-center">
                                    <span className="badge bg-dark">
                                        {new Date(movie.movieReleaseDate) > new Date() ? "Releasing on" : "Released on"} {movie.movieReleaseDate}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-8" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                            <h2 className="fw-bold">{movie.movieName}</h2>
                            <div className="d-flex align-items-center mb-2">
                                <span className="me-2 text-success fw-bold">215.3K are interested</span>
                                <button className="btn btn-outline-secondary btn-sm">I'm interested</button>
                            </div>

                            <div className="mb-3">
                                <span className="badge bg-secondary me-2">2D</span>
                                {<span className="badge bg-light text-dark me-2">{movie.movieLanguage}</span>}
                            </div>
                            <p><strong>{movie.movieDuration} • {movie.movieGenre} • {renderStars(reviews[0]?.rating)}</strong></p>
                            <button className="btn btn-danger btn-lg m-1" onClick={handleBookTickets}>Book tickets</button>
                            <button className="btn btn-primary btn-lg m-1" onClick={scrollToTrailer}>
                                <FaPlay className="me-2" /> Watch Trailer
                            </button>
                            <h5 className="fw-bold">About the movie</h5>
                            <p className="text-muted">{movie.movieDescription}</p>

                            <div className="mt-4">
                                <h5 className="fw-bold">User Reviews</h5>
                                {reviews.length > 0 ? (
                                    <div className="list-group">
                                        {reviews.map((review, index) => (
                                            <div key={index} className="list-group-item d-flex">
                                                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" 
                                                    style={{ width: "40px", height: "40px", fontSize: "18px", fontWeight: "bold" }} >
                                                    {review.user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-grow-1">
                                                    <h6 className="mb-1">{review.user.username}</h6>
                                                    <p className="mb-1">{review.reviewMsg}</p>
                                                    <div>{renderStars(review.rating)}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted">No reviews available.</p>
                                )}
                            </div>
                            
                            {movie.movieTrailer && getYouTubeEmbedUrl(movie.movieTrailer) && (
                                <div id="watchtrailer" className="mt-4">
                                    <h5 className="fw-bold">Watch Trailer</h5>
                                    <div className="ratio ratio-16x9">
                                        <iframe 
                                            src={getYouTubeEmbedUrl(movie.movieTrailer)} 
                                            title="Movie Trailer" 
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default BookMovie;
