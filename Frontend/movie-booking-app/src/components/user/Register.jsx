import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleUserTypeChange = (type) => {
        setUserType(type);
    };

    const validateFields = () => {
        if (!username || !password || !firstName || !lastName || !email || !phone || !userType) {
            setMessage("All fields are required.");
            return false;
        }

        if (!/^[A-Za-z]+$/.test(firstName)) {
            setMessage("First name should contain only alphabets.");
            return false;
        }

        if (!/^[A-Za-z]+$/.test(lastName)) {
            setMessage("Last name should contain only alphabets.");
            return false;
        }

        if (!email.includes("@") || !email.endsWith(".com")) {
            setMessage("Email should contain '@' and end with '.com'.");
            return false;
        }

        if (!/^[A-Za-z][A-Za-z0-9]*$/.test(username)) {
            setMessage("Username should be alphanumeric and must not start with a number.");
            return false;
        }
        
        if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,10}$/.test(password)) {
            setMessage("Password should be 5-10 characters, alphanumeric with at least one special character.");
            return false;
        }

        if (!/^\d{10}$/.test(phone)) {
            setMessage("Phone number should be 10 digits only.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateFields()) {
            return;
        }

        const role = userType === "customer" ? "Customer" : "Admin";

        const payload = {
            username,
            password,
            role,
            first_name: firstName,
            last_name: lastName,
            email,
            phone
        };

        try {
            const response = await fetch("http://localhost:8080/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Registration successful!");
                navigate('/login');
                setMessage("");
                setUsername("");
                setPassword("");
                setUserType("");
                setFirstName("");
                setLastName("");
                setEmail("");
                setPhone("");
            } else {
                const data = await response.json();
                setMessage(data.error || "Failed to register. Please try again.");
            }
        } catch (error) {
            setMessage("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            {/* Header with App Title */}
            <header className="text-center m-5">
                <h1 className="text-white">Register to Book Karo</h1>
                <p className="text-white">Your Gateway to the Best Movies</p>
                <div className="text-center mt-3">
                    <button>
                        <Link to="/login" className="text-decoration-none">
                            Back to Login
                        </Link>
                    </button>
                </div>
            </header>
            
            <div className="card p-4 shadow-sm" style={{ maxWidth: '800px' }}>
                <h2 className="text-center mb-3">Register</h2>
                <form onSubmit={handleSubmit}>
                    {/* First Name and Last Name Row */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="lastName" className="form-label">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>
                    {/* Username and Password Row */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>
                    {/* Email and Phone */}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Phone</label>
                        <input
                            type="text"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    {/* User Type */}
                    <div className="mb-3">
                        <span className="form-label">User Type</span>
                        <div>
                            <label className="form-check-label me-3">
                                <input
                                    type="radio"
                                    name="userType"
                                    value="customer"
                                    checked={userType === "customer"}
                                    onChange={() => handleUserTypeChange("customer")}
                                    className="form-check-input"
                                />
                                Customer
                            </label>
                            <label className="form-check-label">
                                <input
                                    type="radio"
                                    name="userType"
                                    value="admin"
                                    checked={userType === "admin"}
                                    onChange={() => handleUserTypeChange("admin")}
                                    className="form-check-input"
                                />
                                Admin
                            </label>
                        </div>
                    </div>
                    {/* Submit Button */}
                    <button className="btn btn-primary w-100" type="submit">Register</button>
                </form>
                {message && (
                    <div className="alert alert-info text-center mt-3">{message}</div>
                )}
            </div>
        </div>
    );
};

export default Register;
