import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import Nav from './Nav';
import CurrentShows from './CurrentShows';  
import '../../resources/LandingPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserDashboard = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="landing-container container-fluid">
            <Nav isAuthenticated={isAuthenticated} user={user} />

            <header className="landing-header text-center py-5 px-0 w-100">
                <div className="header-content">
                    <h1 className="display-4 text-white">Welcome, {user}!</h1>
                    <p className="lead">Enjoy a seamless movie booking experience</p>
                </div>
            </header>

            {/* Current shows component */}
            <CurrentShows />

            <div className="landing-content text-center mb-5 px-3">
                <p className="lead text-muted">
                    Explore trending movies, exclusive premieres, and personalized recommendations just for you!
                </p>
                <button className="btn btn-danger btn-lg">
                    Browse Now
                </button>
            </div>

            <footer className="landing-footer bg-dark text-white py-3">
                <p className="text-center mb-0">&copy; 2025 Movie Booking. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default UserDashboard;