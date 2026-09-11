import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import brandLogo from '../assets/brand.png';
import './Signup.css';

export const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('buyer');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                'http://localhost:5000/api/auth/register',
                {
                    name,
                    email,
                    password,
                    role
                }
            );

            alert('Registration successful! Please login.');
            navigate('/login');

        } catch (err) {
            alert(
                err.response?.data?.error ||
                'Registration failed'
            );
        }
    };

    return (
        <div className="signup-page">

            <div className="signup-card">

                {/* =========================
                    LEFT BRAND SECTION
                ========================== */}

                <div className="signup-brand-panel">

                    <div className="signup-brand-content">

                        <div className="signup-logo-container">
                            <img
                                src={brandLogo}
                                alt="EcoBazaar Logo"
                                className="signup-brand-logo"
                            />
                        </div>

                        <div className="signup-brand-text">

                            <div className="signup-mini-label">
                                🌿 WELCOME TO
                            </div>

                            <h1>EcoBazaar</h1>

                            <span className="signup-badge">
                                Sustainable Marketplace
                            </span>

                            <p>
                                Join a community that believes every
                                purchase can make a positive impact
                                on our planet.
                            </p>

                        </div>


                        {/* Benefits */}

                        <div className="signup-benefits">

                            <div className="signup-benefit">
                                <span>🌱</span>
                                <div>
                                    <strong>Shop Green</strong>
                                    <small>Eco-friendly products</small>
                                </div>
                            </div>

                            <div className="signup-benefit">
                                <span>🤝</span>
                                <div>
                                    <strong>Join Community</strong>
                                    <small>Connect with conscious people</small>
                                </div>
                            </div>

                            <div className="signup-benefit">
                                <span>♻️</span>
                                <div>
                                    <strong>Make an Impact</strong>
                                    <small>Choose a greener future</small>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>


                {/* =========================
                    RIGHT SIGNUP SECTION
                ========================== */}

                <div className="signup-form-panel">

                    <div className="signup-form-card">

                        {/* Header */}

                        <div className="signup-header">

                            <span className="signup-welcome">
                                ✦ Let's get started
                            </span>

                            <h2>
                                Create your
                                <span> account</span>
                            </h2>

                            <p>
                                Start your sustainable journey
                                with EcoBazaar today.
                            </p>

                        </div>


                        {/* Role Selection */}

                        <div className="signup-role-box">

                            <div className="signup-role-title">
                                I want to join as
                            </div>

                            <div className="signup-role-switch">

                                <button
                                    type="button"
                                    className={
                                        `signup-role-btn ${
                                            role === 'buyer'
                                                ? 'signup-active'
                                                : ''
                                        }`
                                    }
                                    onClick={() => setRole('buyer')}
                                >
                                    <span>🛒</span>
                                    <div>
                                        <strong>Buyer</strong>
                                        <small>Shop products</small>
                                    </div>
                                </button>


                                <button
                                    type="button"
                                    className={
                                        `signup-role-btn ${
                                            role === 'seller'
                                                ? 'signup-active'
                                                : ''
                                        }`
                                    }
                                    onClick={() => setRole('seller')}
                                >
                                    <span>🏪</span>
                                    <div>
                                        <strong>Seller</strong>
                                        <small>Sell products</small>
                                    </div>
                                </button>

                            </div>

                        </div>


                        {/* Form */}

                        <form
                            onSubmit={handleSignup}
                            className="signup-form"
                        >

                            {/* Name */}

                            <div className="signup-field">

                                <label>Full Name</label>

                                <div className="signup-input">

                                    <span>👤</span>

                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            {/* Email */}

                            <div className="signup-field">

                                <label>Email Address</label>

                                <div className="signup-input">

                                    <span>✉️</span>

                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            {/* Password */}

                            <div className="signup-field">

                                <div className="signup-label-row">
                                    <label>Password</label>

                                    <span>
                                        8+ characters recommended
                                    </span>
                                </div>

                                <div className="signup-input">

                                    <span>🔒</span>

                                    <input
                                        type="password"
                                        placeholder="Create a strong password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            {/* Submit */}

                            <button
                                type="submit"
                                className="signup-submit"
                            >

                                <span>
                                    {role === 'seller'
                                        ? 'Create Seller Account'
                                        : 'Create Buyer Account'
                                    }
                                </span>

                                <b>→</b>

                            </button>

                        </form>


                        {/* Login Redirect */}

                        <div className="signup-footer">

                            <span>
                                Already part of EcoBazaar?
                            </span>

                            <Link to="/login">
                                Sign in
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Signup;