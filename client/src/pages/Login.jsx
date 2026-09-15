import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import brandLogo from '../assets/brand.png';
import './Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* =========================================
          BACKGROUND DECORATION
      ========================================= */}

      <div className="login-bg-orb login-bg-orb-one"></div>
      <div className="login-bg-orb login-bg-orb-two"></div>
      <div className="login-bg-orb login-bg-orb-three"></div>

      <div className="login-bg-pattern"></div>


      {/* =========================================
          MAIN LOGIN CARD
      ========================================= */}

      <div className="login-card">


        {/* =========================================
            LEFT BRAND PANEL
        ========================================= */}

        <section className="login-brand-section">

          <div className="brand-glow"></div>

          <div className="login-brand-content">

            {/* Logo */}

            <div className="login-logo-wrapper">

              <div className="login-logo-ring"></div>

              <div className="login-logo-ring login-logo-ring-two"></div>

              <div className="login-logo-core">

                <img
                  src={brandLogo}
                  alt="EcoBazaar Logo"
                  className="login-logo"
                />

              </div>

            </div>


            {/* Brand Heading */}

            <div className="login-brand-heading">

              <span className="login-small-title">
                🌿 WELCOME BACK TO
              </span>

              <h1>
                Eco<span>Bazaar</span>
              </h1>

              <div className="login-badge">
                <span className="badge-dot"></span>
                Sustainable Marketplace
              </div>

              <p>
                Your sustainable shopping journey starts here.
                Discover eco-friendly products and connect
                with a community that cares about tomorrow.
              </p>

            </div>


            {/* =========================================
                FEATURE CARDS
            ========================================= */}

            <div className="login-features">

              <div className="login-feature">

                <div className="login-feature-icon">
                  🌱
                </div>

                <div className="login-feature-text">
                  <strong>Shop Sustainably</strong>
                  <span>Better choices for our planet</span>
                </div>

                <div className="feature-arrow">
                  →
                </div>

              </div>


              <div className="login-feature">

                <div className="login-feature-icon">
                  ♻️
                </div>

                <div className="login-feature-text">
                  <strong>Make an Impact</strong>
                  <span>Every purchase makes a difference</span>
                </div>

                <div className="feature-arrow">
                  →
                </div>

              </div>


              <div className="login-feature">

                <div className="login-feature-icon">
                  🤝
                </div>

                <div className="login-feature-text">
                  <strong>Green Community</strong>
                  <span>Connect with conscious people</span>
                </div>

                <div className="feature-arrow">
                  →
                </div>

              </div>

            </div>

          </div>


          {/* Brand Bottom */}

          <div className="login-brand-bottom">

            <div className="brand-bottom-icon">
              🌍
            </div>

            <div>
              <span>Building a greener tomorrow</span>
              <small>Together, one choice at a time.</small>
            </div>

          </div>

        </section>



        {/* =========================================
            RIGHT LOGIN PANEL
        ========================================= */}

        <section className="login-form-section">

          <div className="login-form-container">


            {/* Top Status */}

            <div className="login-top-status">

              <span className="status-dot"></span>

              <span>SECURE LOGIN</span>

              <span className="status-line"></span>

              <span className="status-text">
                ECOBAZAAR
              </span>

            </div>


            {/* =========================================
                HEADER
            ========================================= */}

            <div className="login-header">

              <span className="login-header-label">
                ✦ MEMBER ACCESS
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


            {/* =========================================
                ROLE SELECTOR
            ========================================= */}

            <div className="login-role-section">

              <div className="login-role-label-row">

                <span className="login-role-label">
                  CONTINUE AS
                </span>

                <span className="role-hint">
                  Choose your account type
                </span>

              </div>


              <div className="login-role-switch">


                {/* BUYER */}

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

                  <span className="login-role-radio">
                    {role === 'buyer' && '✓'}
                  </span>

                </button>


                {/* SELLER */}

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

                  <span className="login-role-radio">
                    {role === 'seller' && '✓'}
                  </span>

                </button>

              </div>

            </div>



            {/* =========================================
                LOGIN FORM
            ========================================= */}

            <form
              onSubmit={handleAuth}
              className="login-form"
            >


              {/* EMAIL */}

              <div className="login-field">

                <label htmlFor="login-email">
                  Email Address
                </label>

                <div className="login-input-wrapper">

                  <span className="login-input-icon">
                    @
                  </span>

                  <input
                    id="login-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    autoComplete="username"
                    required
                  />

                  <span className="input-check">
                    ✓
                  </span>

                </div>

              </div>



              {/* PASSWORD */}

              <div className="login-field">

                <div className="login-label-row">

                  <label htmlFor="login-password">
                    Password
                  </label>

                  <button
                    type="button"
                    className="login-forgot"
                    onClick={() =>
                      alert(
                        'Password recovery coming soon.'
                      )
                    }
                  >
                    Forgot password?
                  </button>

                </div>


                <div className="login-input-wrapper">

                  <span className="login-input-icon">
                    ◆
                  </span>

                  <input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    autoComplete="current-password"
                    required
                  />

                </div>

              </div>



              {/* =========================================
                  SUBMIT BUTTON
              ========================================= */}

              <button
                type="submit"
                className={`login-submit ${
                  loading ? 'login-submit-loading' : ''
                }`}
                disabled={loading}
              >

                <span className="login-submit-text">

                  {loading
                    ? 'Authenticating...'
                    : role === 'seller'
                    ? 'Sign In as Seller'
                    : 'Sign In to Dashboard'
                  }

                </span>

                <span className="login-submit-arrow">
                  {loading ? '◌' : '→'}
                </span>

              </button>

            </form>



            {/* =========================================
                DIVIDER
            ========================================= */}

            <div className="login-divider">

              <span></span>

              <p>OR</p>

              <span></span>

            </div>



            {/* =========================================
                SIGNUP
            ========================================= */}

            <div className="login-signup">

              <span>
                New to EcoBazaar?
              </span>

              <Link to="/signup">
                Create an account
                <span className="signup-arrow">
                  →
                </span>
              </Link>

            </div>



            {/* =========================================
                ADMIN PORTAL
            ========================================= */}

            <div className="login-admin-section">

              <div className="admin-shortcut-line"></div>

              <button
                type="button"
                onClick={() => navigate('/admin/login')}
                className="login-admin-btn"
              >

                <span className="admin-btn-icon">
                  🛡️
                </span>

                <span className="admin-btn-content">
                  <strong>Admin Portal</strong>
                  <small>Restricted access</small>
                </span>

                <span className="admin-btn-arrow">
                  →
                </span>

              </button>

            </div>



            {/* =========================================
                SECURITY FOOTER
            ========================================= */}

            <div className="login-security">

              <div className="security-icon">
                🔐
              </div>

              <div className="security-text">

                <strong>
                  Secure Authentication
                </strong>

                <p>
                  Your account information is protected
                  with secure authentication.
                </p>

              </div>

              <span className="security-check">
                ✓
              </span>

            </div>

          </div>

        </section>

      </div>


      {/* =========================================
          PAGE FOOTER
      ========================================= */}

      <div className="login-page-footer">

        <span>
          © EcoBazaar
        </span>

        <i></i>

        <span>
          Sustainable Shopping
        </span>

        <i></i>

        <span>
          Better Future
        </span>

      </div>

    </div>
  );
};

export default Login;