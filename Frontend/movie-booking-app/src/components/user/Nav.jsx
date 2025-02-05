import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { logout } from '../../redux/authSlice';
import { useDispatch } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navigation = ({ isAuthenticated, user }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
            dispatch(logout());
            setTimeout(() => {
                navigate('/'); 
            }, 20);
        };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand>Book Karo</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {isAuthenticated && (
                            <Navbar.Text className="text-white me-3">Welcome {user} :)</Navbar.Text>
                        )}
                        <Nav.Link as={Link} to="/user-dashboard">Home</Nav.Link>
                        <Nav.Link as={Link} to="/movies">Movies</Nav.Link>
                        <Nav.Link as={Link} to="/book">Book a Movie</Nav.Link>
                        {isAuthenticated && (
                            <Nav.Link as={Link} to="/user/updateProfile">Profile</Nav.Link>
                        )}
                        {isAuthenticated ? (
                            <Button variant="outline-light" onClick={handleLogout} className="ms-2">
                                Logout
                            </Button>
                        ) : (
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
