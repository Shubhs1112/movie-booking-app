import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import Nav from './Nav';
import '../../resources/LandingPage.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const LandingPage = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const indianMovies = [
        'https://imgs.search.brave.com/RlpLca-c2qXAP2DEaD_xi1Xl-W2q-YelZ113OeAXIR4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHNjZG4xLnBheXRt/LmNvbS9pbWFnZXMv/Y2luZW1hL1Nvb2tz/aG1hZGFyc2hpbmkt/MmVhZjJmMDAtYTFi/NS0xMWVmLThiOTAt/NjdmMDc1ZDcyNWQ5/LmpwZz9mb3JtYXQ9/d2VicA',
        'https://imgs.search.brave.com/XKPvWUD57pM_7UJe8cKct1QXHfeUcv8n7HuJ0JnMryY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/MXNkYWJwNG50Mm0y/MS5qcGc_d2lkdGg9/NjQwJmNyb3A9c21h/cnQmYXV0bz13ZWJw/JnM9MWJjN2NlOGNj/NzQ4Mjc0OWRmYzk3/MTIyNGI2YTQ3MGIw/OWE0YzY0MA',
        'https://imgs.search.brave.com/myKntVt5bxDwHcEC4DsfTpGMlZfhMGQhnviI3lcz-HM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuanVzdHdhdGNo/LmNvbS9wb3N0ZXIv/MzIwNDk5NjM1L3Mz/MzIvbXVtYmFpLXB1/bmUtbXVtYmFp',
        'https://imgs.search.brave.com/PQ2_30HVBlRG6skkDSR4mIs23hbFJ0pFgY70IO81C7k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuanVzdHdhdGNo/LmNvbS9wb3N0ZXIv/MzE5NzMzNDAyL3Mz/MzIvcm9ja3ktYXVy/LXJhbmkta2ktcHJl/bS1rYWhhbmk',
        'https://imgs.search.brave.com/LL1vjpwRC6ppw7iZLR-MWUaI7wUI7WzpnBq87l8_e5M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/anVzdHdhdGNoLmNv/bS9pbWFnZXMvcG9z/dGVyLzMyMDU5NTYw/NS9zMzMyL25hYWNo/LWdhLWdodW1h'
    ];

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="landing-container container-fluid">
            <Nav
                isAuthenticated={isAuthenticated}
                user={user}
                handleLogout={handleLogout}
            />

            <header className="landing-header text-center py-5 px-0 w-100">
            <div className="header-content">
                <h1 className="display-4 text-white">Welcome to Book Karo</h1>
                <p className="lead">Your one-stop platform to book your favorite movies</p>
            </div>
            </header>
            <div className="container mb-5">
                <div className="row g-4 justify-content-center">
                    {indianMovies.map((poster, index) => (
                        <div className="col-6 col-md-2" key={index}>
                            <div className="card h-100 shadow-sm" id="poster">
                                <img 
                                    src={poster} 
                                    alt={`Bollywood Movie ${index + 1}`}
                                    className="card-img-top img-fluid movie-poster"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="card-body p-2 text-center">
                                    <button className="btn btn-danger btn-sm w-100">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="landing-content text-center mb-5 px-3">
                <p className="lead text-muted">
                    Discover a wide variety of movies across genres - from Bollywood blockbusters to regional cinema. 
                    Book tickets for the latest releases in Hindi, Tamil, Telugu, Malayalam, and more!
                </p>
                <button className="btn btn-danger btn-lg">
                    Explore Movies
                </button>
            </div>

            <footer className="landing-footer bg-dark text-white py-3">
                <p className="text-center mb-0">&copy; 2025 Movie Booking. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;