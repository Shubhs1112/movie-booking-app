import React from 'react';
import { Link } from 'react-router-dom';


const Nav = ({ isAuthenticated, user, handleLogout }) => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h2>Book Karo</h2>
            </div>
            <ul className="navbar-links">
                {isAuthenticated && (
                    <li>
                        <h1 className="text-white">Welcome {user}</h1>
                    </li>
                )}
                <li>
                    <Link to="/" className="navbar-link">Home</Link>
                </li>
                <li>
                    <Link to="/movies" className="navbar-link">Movies</Link>
                </li>
                <li>
                    <Link to="/book" className="navbar-link">Book a Movie</Link>
                </li>
                {isAuthenticated && (
                    <li>
                        <Link to="/updateProfile" className="navbar-link">Profile</Link>
                    </li>
                )}
                {isAuthenticated ? (
                    <li>
                        <button onClick={handleLogout} className="navbar-link logout-button">
                            Logout
                        </button>
                    </li>
                ) : (
                    <li>
                        <Link to="/login" className="navbar-link">Login</Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Nav;
