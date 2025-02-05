import React, { useState } from 'react';
import { useSelector} from 'react-redux';
import { logout } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';
import CurrentShows from './CurrentShows';  
import '../../resources/LandingPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [showPopup, setShowPopup] = useState(false);

    const handleExploreMovies = () => {
        if (!isAuthenticated) {
            setShowPopup(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);  // Redirect to login after 3 seconds
        } else {
            navigate('/movies');
        }
    };

    return (
        <div className="landing-container container-fluid">
            <Nav isAuthenticated={isAuthenticated} user={user} />

            <header className="landing-header text-center py-5 px-0 w-100">
                <div className="header-content">
                    <h1 className="display-4 text-white">Welcome to Book Karo</h1>
                    <p className="lead">Your one-stop platform to book your favorite movies</p>
                </div>
            </header>

            {/* Current shows are now in a separate component */}
            <CurrentShows />

            <div className="landing-content text-center mb-5 px-3">
                <p className="lead text-muted">
                    Discover a wide variety of movies across genres - from Bollywood blockbusters to regional cinema. 
                    Book tickets for the latest releases in Hindi, Tamil, Telugu, Malayalam, and more!
                </p>
                <button className="btn btn-danger btn-lg" onClick={handleExploreMovies}>
                    Explore Movies
                </button>
            </div>

            {/* Popup message */}
            {showPopup && (
                <div className="popup-container">
                    <div className="popup-message">
                        <p>Login to the website to book a movie</p>
                        <p>Redirecting to Login Page...</p>
                    </div>
                </div>
            )}

            <footer className="landing-footer bg-dark text-white py-3">
                <p className="text-center mb-0">&copy; 2025 Movie Booking. All Rights Reserved.</p>
            </footer>

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

export default LandingPage;
