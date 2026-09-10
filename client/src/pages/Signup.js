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
            await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
                role
            });
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="login-master-wrapper">
            <div className="login-card-container">

                {/* Left Side: Large Prominent Brand Showcase */}
                <div className="login-brand-panel">
                    <div className="brand-showcase-content">
                        <div className="giant-logo-container">
                            <img src={brandLogo} alt="EcoBazaar Logo" className="giant-brand-logo" />
                        </div>

                        <div className="brand-text-block">
                            <h1>EcoBazaar</h1>
                            <span className="theme-badge">Sustainable Marketplace</span>
                            <p>Join our community of eco-conscious buyers and green sellers. Build a sustainable future with us.</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Clean Dashboard-Aligned Signup Form Panel */}
                <div className="login-form-panel">
                    <div className="form-content-box">
                        <div className="form-header-group">
                            <h2>Create Account</h2>
                            <p>Get started with your eco-friendly journey.</p>
                        </div>

                        {/* Role Switcher Pill Tabs */}
                        <div className="role-switch-pill">
                            <button
                                type="button"
                                className={`role-btn ${role === 'buyer' ? 'active-buyer' : ''}`}
                                onClick={() => setRole('buyer')}
                            >
                                🛒 Buyer Portal
                            </button>
                            <button
                                type="button"
                                className={`role-btn ${role === 'seller' ? 'active-seller' : ''}`}
                                onClick={() => setRole('seller')}
                            >
                                🏪 Seller Portal
                            </button>
                        </div>

                        <form onSubmit={handleSignup} className="modern-auth-form">
                            <div className="form-field-group">
                                <label>Full Name</label>
                                <div className="input-with-icon">
                                    <span className="field-icon">👤</span>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-field-group">
                                <label>Email Address</label>
                                <div className="input-with-icon">
                                    <span className="field-icon">📧</span>
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-field-group">
                                <label>Password</label>
                                <div className="input-with-icon">
                                    <span className="field-icon">🔒</span>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="action-submit-btn">
                                {role === 'seller' ? 'Register as Seller ➔' : 'Create Buyer Account ➔'}
                            </button>
                        </form>

                        <div className="auth-footer-redirect">
                            <p>Already have an account? <Link to="/login">Login</Link></p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Signup;