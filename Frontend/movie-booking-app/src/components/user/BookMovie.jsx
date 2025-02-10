import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate} from 'react-router-dom';
import { FaStar, FaRegStar, FaPlay, FaPlus } from "react-icons/fa";
import Nav from './Nav';

const BookMovie = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { movieId } = useParams();
    const navigate = useNavigate();
    
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]); 
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // New states for adding a review
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewMessage, setReviewMessage] = useState("");
    const [rating, setRating] = useState(0);
    
    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const [movieResponse, reviewsResponse] = await Promise.all([
                    fetch(`http://localhost:8180/management/Admin/movies/${movieId}`),
                    fetch(`http://localhost:8180/management/Admin/GetReviewsByMovieId/${movieId}`)
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

        // Fetch user ID
        const fetchUserId = async () => {
            if (user) {
                try {
                    const response = await fetch(`http://localhost:8180/auth/${user}`);
                    const data = await response.json();
                    setUserId(data.user_id);
                } catch (error) {
                    console.error("Failed to fetch user ID:", error);
                }
            }
        };

        fetchMovieData();
        fetchUserId();
    }, [movieId, user]);

    // Render Stars for reviews
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? <FaStar key={i} className="text-warning" /> : <FaRegStar key={i} className="text-secondary" />);
        }
        return stars;
    };

    // Render Stars for reviews (Clickable if setRating is provided)
    const renderStarsF = (rating, setRating = null) => {
        return [...Array(5)].map((_, i) => {
            const starValue = i + 1;
            return (
                <span 
                    key={starValue} 
                    className={starValue <= rating ? "text-warning" : "text-secondary"} 
                    style={setRating ? { cursor: "pointer" } : {}}
                    onClick={() => setRating && setRating(starValue)} // Make stars clickable
                >
                    {starValue <= rating ? <FaStar /> : <FaRegStar />}
                </span>
            );
        });
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

    // Submit Review
    const handleSubmitReview = async () => {
        if (!reviewMessage || rating === 0) {
            alert("Please enter a review message and select a rating.");
            return;
        }

        const newReview = {
            reviewMsg: reviewMessage,
            rating,
            movieId,
            userId
        };

        try {
            console.log("Submitting Review:", JSON.stringify({
                reviewMsg: reviewMessage,
                rating: rating,
                movieId: movieId,
                userId: userId
            }, null, 2));
            
            const response = await fetch("http://localhost:8180/management/Admin/reviews/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newReview),
            });

            console.log("Submitting Review:", newReview);


            if (response.ok) {
                alert("Review submitted successfully!");

                const updatedReviewsResponse = await fetch(`http://localhost:8180/management/Admin/GetReviewsByMovieId/${movieId}`);
                const updatedReviews = await updatedReviewsResponse.json();
                
                setReviews(updatedReviews); // Update state with fresh data
                setReviewMessage("");
                setRating(0);
                setShowReviewForm(false);
            } else {
                alert("Failed to submit review.");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Error submitting review. Please try again.");
        }
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
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <h5 className="fw-bold mb-0">User Reviews</h5>
                                    <button className="btn btn-success btn-sm" onClick={() => setShowReviewForm(!showReviewForm)}>
                                        <FaPlus /> Add Review
                                    </button>
                                </div>

                                {showReviewForm && (
                                    <div className="card p-3 mb-3">
                                        <textarea className="form-control mb-2" 
                                                placeholder="Write your review..." 
                                                value={reviewMessage} 
                                                onChange={(e) => setReviewMessage(e.target.value)} />
                                        <div className="mb-2">{renderStarsF(rating, setRating)}</div> 
                                        <button className="btn btn-primary btn-sm" onClick={handleSubmitReview}>Post Review</button>
                                    </div>
                                )}

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
