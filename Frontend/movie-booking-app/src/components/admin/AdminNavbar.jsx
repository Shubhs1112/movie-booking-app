import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { FaHome, FaTachometerAlt, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminNavbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    // Redirect after logout
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin');
        }
    }, [isAuthenticated, navigate]);

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand>
                    Book Karo
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {isAuthenticated ? (
                        <Nav.Link as={Link} to="/admin-dashboard">
                            <FaHome className="me-2" /> Home
                        </Nav.Link>
                        ): <Nav.Link as={Link} to="/admin">
                        <FaHome className="me-2" /> Home
                    </Nav.Link>}
                        {isAuthenticated && (
                            <Nav.Link as={Link} to="/admin/updateProfile">
                                <FaUserCircle className="me-2" /> Profile
                            </Nav.Link>
                        )}
                        <Nav.Link as={Link} to={isAuthenticated ? "#" : "/login"} onClick={isAuthenticated ? handleLogout : null}>
                            {isAuthenticated ? <FaSignOutAlt className="me-2" /> : ''} {isAuthenticated ? 'Logout' : 'Login'}
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AdminNavbar;
