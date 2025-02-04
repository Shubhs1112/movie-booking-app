import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import AdminNav from '../admin/AdminNavbar';
import image1 from '../../resources/images/AdminDashboard1.jpg';
import image2 from '../../resources/images/AdminDashboard2.jpg';
import image3 from '../../resources/images/AdminDashboard3.jpg';

const AdminLandingPage = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    return (
        <>
            <AdminNav />
            <Container fluid className="text-center">
                {/* Static Content for Non-Logged-in Admin */}
                <Row className="justify-content-center mt-5">
                    <Col md={10} lg={8}>
                        <h1 className="fw-bold text-white display-4 p-4">Book Karo Admin Dashboard</h1>
                        <p className="text-gray fs-5">
                            As an admin, you have full control over managing movies, scheduling shows, and handling user activities.
                            <br />
                            <strong>Please log in to access the full dashboard.</strong>
                        </p>
                    </Col>
                </Row>

                {/* Overview Cards */}
                <Row className="justify-content-center mt-4">
                    <Col md={3} className="d-flex">
                        <Card className="shadow-lg flex-fill text-center" style={{ width: '100%', minHeight: '250px' }}>
                            <Card.Img variant="top" src={image1} style={{ height: '200px', objectFit: 'cover' }} />
                            <Card.Body style={{ minHeight: '100px', padding: '10px' }}>
                                <Card.Title className="fw-bold text-dark">Manage Movies</Card.Title>
                                <Card.Text className="text-muted">Add, edit, and remove movies from the database.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className="d-flex">
                        <Card className="shadow-lg flex-fill text-center" style={{ width: '100%', minHeight: '250px' }}>
                            <Card.Img variant="top" src={image2} style={{ height: '200px', objectFit: 'cover' }} />
                            <Card.Body style={{ minHeight: '100px', padding: '10px' }}>
                                <Card.Title className="fw-bold text-dark">Schedule Shows</Card.Title>
                                <Card.Text className="text-muted">Organize and manage show timings for different cinemas.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className="d-flex">
                        <Card className="shadow-lg flex-fill text-center" style={{ width: '100%', minHeight: '250px' }}>
                            <Card.Img variant="top" src={image3} style={{ height: '200px', objectFit: 'cover' }} />
                            <Card.Body style={{ minHeight: '100px', padding: '10px' }}>
                                <Card.Title className="fw-bold text-dark">Monitor Users</Card.Title>
                                <Card.Text className="text-muted">View and manage registered users and bookings.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <footer className="text-center mt-5 p-3 bg-dark text-white">
                &copy; 2025 Book-Karo. All Rights Reserved.
            </footer>
        </>
    );
};

export default AdminLandingPage;
