import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import brandLogo from '../assets/brand.png';
import './Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        const userRole = res.data.user.role || role;
        if (userRole === 'seller' || role === 'seller') {
          navigate('/seller');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-master-wrapper">
      <div className="login-card-container">

        {/* Left Side: Large Prominent Brand Showcase matching Dashboard Theme */}
        <div className="login-brand-panel">
          <div className="brand-showcase-content">
            <div className="giant-logo-container">
              <img src={brandLogo} alt="EcoBazaar Logo" className="giant-brand-logo" />
            </div>

            <div className="brand-text-block">
              <h1>EcoBazaar</h1>
              <span className="theme-badge">Sustainable Marketplace</span>
              <p>Manage your eco-friendly store, track real-time green metrics, and connect with conscious buyers seamlessly.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Dashboard-Aligned Form Panel */}
        <div className="login-form-panel">
          <div className="form-content-box">
            <div className="form-header-group">
              <h2>Welcome Back</h2>
              <p>Sign in to continue to your dashboard workspace.</p>
            </div>

            {/* Role Switcher Tabs */}
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

            <form onSubmit={handleAuth} className="modern-auth-form">
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
                {role === 'seller' ? 'Sign In as Seller ➔' : 'Sign In to Dashboard ➔'}
              </button>
            </form>

            <div className="auth-footer-redirect">
              <p>New to EcoBazaar? <Link to="/signup">Create an account</Link></p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;