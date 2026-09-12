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
      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        {
          email,
          password
        }
      );

      if (res.data.user) {
        localStorage.setItem(
          'user',
          JSON.stringify(res.data.user)
        );

        const userRole = res.data.user.role || role;

        if (userRole === 'seller' || role === 'seller') {
          navigate('/seller');
        } else {
          navigate('/dashboard');
        }
      }

    } catch (err) {
      alert(
        err.response?.data?.error ||
        'Authentication failed. Please check your credentials.'
      );
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* ================= LEFT BRAND SECTION ================= */}

        <div className="login-brand-section">

          <div className="login-brand-content">

            <div className="login-logo-wrapper">
              <img
                src={brandLogo}
                alt="EcoBazaar Logo"
                className="login-logo"
              />
            </div>

            <div className="login-brand-heading">

              <span className="login-small-title">
                🌿 WELCOME BACK TO
              </span>

              <h1>EcoBazaar</h1>

              <div className="login-badge">
                <span>✦</span>
                Sustainable Marketplace
              </div>

              <p>
                Your sustainable shopping journey starts
                here. Discover eco-friendly products and
                connect with conscious communities.
              </p>

            </div>

            {/* Feature cards */}

            <div className="login-features">

              <div className="login-feature">

                <div className="login-feature-icon">
                  🌱
                </div>

                <div>
                  <strong>Shop Sustainably</strong>
                  <span>Better choices for our planet</span>
                </div>

              </div>

              <div className="login-feature">

                <div className="login-feature-icon">
                  ♻️
                </div>

                <div>
                  <strong>Make an Impact</strong>
                  <span>Every purchase makes a difference</span>
                </div>

              </div>

              <div className="login-feature">

                <div className="login-feature-icon">
                  🤝
                </div>

                <div>
                  <strong>Green Community</strong>
                  <span>Connect with conscious people</span>
                </div>

              </div>

            </div>

          </div>

          <div className="login-brand-bottom">
            <span>🌍</span>
            <span>Building a greener tomorrow, together.</span>
          </div>

        </div>


        {/* ================= RIGHT LOGIN SECTION ================= */}

        <div className="login-form-section">

          <div className="login-form-container">

            {/* Header */}

            <div className="login-header">

              <span className="login-header-label">
                ✦ SECURE ACCESS
              </span>

              <h2>
                Welcome
                <span> back!</span>
              </h2>

              <p>
                Sign in to continue your sustainable
                journey with EcoBazaar.
              </p>

            </div>


            {/* Role Selection */}

            <div className="login-role-section">

              <div className="login-role-label">
                Continue as
              </div>

              <div className="login-role-switch">

                <button
                  type="button"
                  className={`login-role-btn ${
                    role === 'buyer'
                      ? 'login-role-active'
                      : ''
                  }`}
                  onClick={() => setRole('buyer')}
                >

                  <span className="login-role-icon">
                    🛒
                  </span>

                  <span className="login-role-info">
                    <strong>Buyer</strong>
                    <small>Shop products</small>
                  </span>

                  {role === 'buyer' && (
                    <span className="login-check">
                      ✓
                    </span>
                  )}

                </button>


                <button
                  type="button"
                  className={`login-role-btn ${
                    role === 'seller'
                      ? 'login-role-active'
                      : ''
                  }`}
                  onClick={() => setRole('seller')}
                >

                  <span className="login-role-icon">
                    🏪
                  </span>

                  <span className="login-role-info">
                    <strong>Seller</strong>
                    <small>Manage store</small>
                  </span>

                  {role === 'seller' && (
                    <span className="login-check">
                      ✓
                    </span>
                  )}

                </button>

              </div>

            </div>


            {/* Login Form */}

            <form
              onSubmit={handleAuth}
              className="login-form"
            >

              {/* Email */}

              <div className="login-field">

                <label>Email Address</label>

                <div className="login-input-wrapper">

                  <span className="login-input-icon">
                    ✉️
                  </span>

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

              <div className="login-field">

                <div className="login-label-row">

                  <label>Password</label>

                  <button
                    type="button"
                    className="login-forgot"
                    onClick={() =>
                      alert('Password recovery coming soon.')
                    }
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="login-input-wrapper">

                  <span className="login-input-icon">
                    🔒
                  </span>

                  <input
                    type="password"
                    placeholder="Enter your password"
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
                className="login-submit"
              >

                <span>
                  {role === 'seller'
                    ? 'Sign In as Seller'
                    : 'Sign In to Dashboard'
                  }
                </span>

                <span className="login-submit-arrow">
                  →
                </span>

              </button>

            </form>


            {/* Footer */}

            <div className="login-divider">
              <span></span>
              <p>OR</p>
              <span></span>
            </div>


            <div className="login-signup">

              <span>
                New to EcoBazaar?
              </span>

              <Link to="/signup">
                Create an account
                <span> →</span>
              </Link>

            </div>


            {/* ================= ADMIN LOGIN SHORTCUT BUTTON ================= */}
            <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={() => navigate('/admin/login')}
                style={{
                  width: '100%',
                  background: '#000000',
                  color: '#ef1818',
                  border: '1.8px solid #b99a10',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                🛡️ Switch to Admin Portal
              </button>
            </div>


            <div className="login-security">

              <span>🔐</span>

              <p>
                Your information is protected with
                secure authentication.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;