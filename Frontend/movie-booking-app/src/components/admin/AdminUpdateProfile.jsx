import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminNavbar from '../admin/AdminNavbar';

const AdminUpdateProfile = () => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`http://localhost:8180/auth/${user}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
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
        if (password.trim() && password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) return;

        const payload = {
            username,
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            ...(password && { password }),
        };

        try {
            const response = await fetch(`http://localhost:8080/${user}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setMessage('Profile updated successfully!');
            } else {
                const data = await response.json();
                setMessage(data.error || 'Failed to update profile');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <>
            <AdminNavbar />
            <div className="container" style={{ maxWidth: '800px' }}>
                {message && <div className="alert alert-info">{message}</div>}
                <form onSubmit={handleSubmit} className="border p-4 rounded bg-light bg-opacity-75">
                    <h1><FaUserCircle /> Update Profile</h1>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input type="text" className="form-control" value={username} disabled />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">First Name</label>
                        <input type="text" className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Last Name</label>
                        <input type="text" className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={email} onChange={(e) => setEmail(e.target.value)} />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Phone</label>
                        <input type="text" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} value={phone} onChange={(e) => setPhone(e.target.value)} />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>
                    <button 
                    type='button'
                    className="btn btn-danger m-1" onClick={() => navigate('/admin-dashboard')}>
                    &larr; Back
                    </button>
                    <button type="submit" className="btn btn-primary"> Update</button>
                </form>
            </div>
        </>
    );
};

export default AdminUpdateProfile;
