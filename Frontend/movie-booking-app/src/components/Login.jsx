import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../resources/Login.css'; 

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            username: username,
            password: password,
        };

        try {
            const response = await fetch(`http://localhost:8080/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message);

                let user = data;
                dispatch(login(user.username));

                if (user.role === 'Customer') navigate('/user');
                else navigate('/admin-dashboard');
            } else {
                const errorData = await response.json();
                setMessage(errorData.error || 'Login failed');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            {/* Header with App Title */}
            <header className="text-center m-5">
                <h1 className="text-white">Login to Book Karo</h1>
                <p className="text-white">Your Gateway to the Best Movies</p>
            </header>
            <div className="card p-4 shadow" style={{ width: '400px'}}>
                <h2 className="text-center mb-3">Login</h2>
                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-control"
                            required
                            aria-label="Username"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            required
                            aria-label="Password"
                        />
                    </div>

                    {/* Forgot Password */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <button type="submit" className="btn btn-primary w-100">
                            Login
                        </button>
                    </div>
                </form>

                {/* Login Message */}
                {message && <div className="alert alert-danger text-center">{message}</div>}

                {/* Signup Link */}
                <div className="text-center">
                    <p className="mb-1">
                        <Link to="/forgot-password" className="text-decoration-none">
                            Forgot Password?
                        </Link>
                    </p>
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register" className="text-decoration-none">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
