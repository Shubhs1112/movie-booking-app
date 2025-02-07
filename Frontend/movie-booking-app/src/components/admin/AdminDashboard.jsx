import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaUsersCog, FaChartLine, FaCog, FaPhotoVideo, FaUser,FaRegComment  } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import AdminNav from './AdminNavbar';

// Importing Components
import Movies from './Movies';
import AddShow from './AddShow';
import CurrentShows from './CurrentShows';
import ManageUsers from './ManageUsers';
import ManageReviews from './Reviews';
import Analytics from './Analytics';

const AdminDashboard = () => {
    const location = useLocation();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    // Initialize selectedComponent from navigation state or fallback to default
    const [selectedComponent, setSelectedComponent] = useState('manageMovie');

    // Effect to update state when location state changes
    useEffect(() => {
        if (location.state?.selectedComponent) {
            setSelectedComponent(location.state.selectedComponent);
        }
    }, [location.state]);  // Runs whenever location.state updates

    return (
        <>
            <AdminNav />
            <Container fluid className="p-0">
                <Row className="flex-nowrap">
                    <Col md={3} lg={2} className="bg-light bg-opacity-75 p-4 min-vh-100 shadow-lg border rounded-3 d-flex flex-column align-items-start">
                        <h4 className="mb-4 fw-bold text-primary">Admin Panel</h4>

                        <Button variant="light" className={`d-flex align-items-center mb-3 w-100 shadow-sm py-2 px-3 rounded border border-primary bg-opacity-50 ${selectedComponent === 'manageMovie' ? 'active' : ''}`}
                            onClick={() => isAuthenticated && setSelectedComponent('manageMovie')}>
                            <FaPhotoVideo className="me-2 text-primary" /> <span className="fw-semibold">Manage Movies</span>
                        </Button>

                        <Button variant="light" className={`d-flex align-items-center mb-3 w-100 shadow-sm py-2 px-3 rounded border border-success bg-opacity-50 ${selectedComponent === 'currentShows' ? 'active' : ''}`}
                            onClick={() => isAuthenticated && setSelectedComponent('currentShows')}>
                            <FaUsersCog className="me-2 text-success" /> <span className="fw-semibold">Manage Shows</span>
                        </Button>

                        <Button variant="light" className={`d-flex align-items-center mb-3 w-100 shadow-sm py-2 px-3 rounded border border-secondary bg-opacity-50 ${selectedComponent === 'reviews' ? 'active' : ''}`}
                            onClick={() => isAuthenticated && setSelectedComponent('reviews')}>
                            <FaRegComment className="me-2 text-secondary" /> <span className="fw-semibold">Manage Reviews</span>
                        </Button>

                        <Button variant="light" className={`d-flex align-items-center mb-3 w-100 shadow-sm py-2 px-3 rounded border border-warning bg-opacity-50 ${selectedComponent === 'analytics' ? 'active' : ''}`}
                            onClick={() => isAuthenticated && setSelectedComponent('analytics')}>
                            <FaChartLine className="me-2 text-warning" /> <span className="fw-semibold">Analytics</span>
                        </Button>

                        <Button variant="light" className={`d-flex align-items-center mb-3 w-100 shadow-sm py-2 px-3 rounded border border-info bg-opacity-50 ${selectedComponent === 'manageUsers' ? 'active' : ''}`}
                            onClick={() => isAuthenticated && setSelectedComponent('manageUsers')}>
                            <FaUser className="me-2 text-info" /> <span className="fw-semibold">Manage Users</span>
                        </Button>

                        <Button variant="light" className={`d-flex align-items-center w-100 shadow-sm py-2 px-3 rounded border border-danger bg-opacity-50 ${selectedComponent === 'settings' ? 'active' : ''}`}
                            onClick={() => isAuthenticated && setSelectedComponent('settings')}>
                            <FaCog className="me-2 text-danger" /> <span className="fw-semibold">Settings</span>
                        </Button>
                    </Col>

                    <Col md={9} lg={10} className="p-4">
                        <h1 className="fw-bold text-dark">Welcome to Admin Dashboard</h1>
                        <p className="text-muted">Manage movies, shows, users, and system settings from here.</p>
                        
                        {isAuthenticated && selectedComponent === 'manageMovie' && <Movies />}
                        {isAuthenticated && selectedComponent === 'currentShows' && <CurrentShows />}
                        {isAuthenticated && selectedComponent === 'addShow' && <AddShow />}
                        {isAuthenticated && selectedComponent === 'manageUsers' && <ManageUsers />}
                        {isAuthenticated && selectedComponent === 'reviews' && <ManageReviews />}
                        {isAuthenticated && selectedComponent === 'analytics' && <Analytics />}
                    </Col>
                </Row>
            </Container>

            <footer className="text-center mt-5 p-3 bg-dark text-white">
                &copy; 2025 Book-Karo Admin. All Rights Reserved.
            </footer>
        </>
    );
};

export default AdminDashboard;
