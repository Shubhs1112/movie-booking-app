import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/authSlice';
import Nav from './Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateProfile = () => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated, user } = useSelector((state) => state.auth);
    // Logout handler
    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`http://localhost:8180/auth/${user}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsername(data.username);
                    setFirstName(data.first_name);
                    setLastName(data.last_name);
                    setEmail(data.email);
                    setPhone(data.phone);
                } else {
                    setMessage('Failed to fetch user profile');
                }
            } catch (error) {
                setMessage('An error occurred while fetching the profile');
            }
        };

        fetchUserProfile();
    }, [user]);

    const validateFields = () => {
        const newErrors = {};
        if (!firstName.trim()) newErrors.firstName = 'First name is required.';
        if (!lastName.trim()) newErrors.lastName = 'Last name is required.';
        if (!email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            newErrors.email = 'Enter a valid email address.';
        }
        if (!phone.trim()) {
            newErrors.phone = 'Phone number is required.';
        } else if (!/^\d{10}$/.test(phone)) {
            newErrors.phone = 'Phone number must be 10 digits.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) return;

        const payload = {
            username: username,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
        };

        try {
            const response = await fetch(`http://localhost:8080/${user}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert('Profile updated successfully!');
                // setMessage('Profile updated successfully!');
            } else {
                const data = await response.json();
                alert(data.error+'Failed to update profile');
                // setMessage(data.error || 'Failed to update profile');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div>
            <Nav
                isAuthenticated={isAuthenticated}
                user={user}
                handleLogout={handleLogout}
            />

            <div
                className="container d-flex justify-content-center align-items-center vh-100"
            >
                <div className="card p-4 shadow-sm w-100" style={{ maxWidth: '600px' }}>
                    <h2 className="text-center mb-3">Update Profile</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">
                                Username:
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                className="form-control"
                                disabled
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">
                                First Name:
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className={`form-control ${
                                    errors.firstName ? 'is-invalid' : ''
                                }`}
                            />
                            {errors.firstName && (
                                <div className="invalid-feedback">{errors.firstName}</div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">
                                Last Name:
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className={`form-control ${
                                    errors.lastName ? 'is-invalid' : ''
                                }`}
                            />
                            {errors.lastName && (
                                <div className="invalid-feedback">{errors.lastName}</div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`form-control ${
                                    errors.email ? 'is-invalid' : ''
                                }`}
                            />
                            {errors.email && (
                                <div className="invalid-feedback">{errors.email}</div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">
                                Phone:
                            </label>
                            <input
                                type="text"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={`form-control ${
                                    errors.phone ? 'is-invalid' : ''
                                }`}
                            />
                            {errors.phone && (
                                <div className="invalid-feedback">{errors.phone}</div>
                            )}
                        </div>
                        <button className="btn btn-primary w-100" type="submit">
                            Update
                        </button>
                    </form>
                    {message && (
                        <div className="alert alert-info text-center mt-3">{message}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateProfile;
