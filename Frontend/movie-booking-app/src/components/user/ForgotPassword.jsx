import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const validateEmail = () => {
        if (!email) {
            setMessage("Email is required.");
            return false;
        }

        if (!email.includes("@") || !email.endsWith(".com")) {
            setMessage("Email should contain '@' and end with '.com'.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail()) {
            return;
        }

        const payload = { email };

        try {
            const response = await fetch("http://localhost:8180/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setMessage("A password reset link has been sent to your email.");
                setTimeout(() => navigate("/login"), 3000); // Redirect after 3 seconds
            } else {
                const data = await response.json();
                setMessage(data.error || "Failed to send password reset link.");
            }
        } catch (error) {
            setMessage("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            {/* Header with App Title */}
            <header className="text-center m-5">
                <h1 className="text-white">Forgot Password</h1>
                <p className="text-white">Reset your password here</p>
            </header>
            <div className="card p-4 shadow-sm" style={{ maxWidth: '600px' }}>
                <h2 className="text-center mb-3">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button className="btn btn-primary w-100" type="submit">Send Reset Link</button>
                </form>

                {message && (
                    <div className="alert alert-info text-center mt-3">{message}</div>
                )}

                {/* Link to Login */}
                <div className="text-center mt-3">
                    <p>
                        <Link to="/login" className="text-decoration-none">
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
