import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/brand.png';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/admin/login',
        credentials
      );

      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);

        localStorage.setItem(
          'adminUser',
          JSON.stringify(res.data.user)
        );

        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Access Denied: Invalid Admin Credentials'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">

      {/* =====================================================
          BACKGROUND EFFECTS
      ===================================================== */}

      <div className="admin-bg-glow admin-bg-glow-1"></div>
      <div className="admin-bg-glow admin-bg-glow-2"></div>
      <div className="admin-grid"></div>

      {/* =====================================================
          TOP NAV
      ===================================================== */}

      <header className="admin-topbar">

        <div className="admin-top-brand">

          <img
            src={logoImg}
            alt="EcoBazaar"
          />

          <span></span>

          <p>
            SUSTAINABLE TODAY.
            <strong> GREENER TOMORROW.</strong>
          </p>

        </div>

        <div className="admin-system-status">
          <i></i>
          SYSTEM ONLINE
        </div>

      </header>


      {/* =====================================================
          MAIN SPLIT LAYOUT
      ===================================================== */}

      <main className="admin-main">

        {/* ===================================================
            LEFT BRANDING SECTION
        =================================================== */}

        <section className="admin-hero">

          <div className="hero-content">

            {/* LARGE LOGO */}

            <div className="hero-logo">

              <div className="hero-logo-ring ring-1"></div>
              <div className="hero-logo-ring ring-2"></div>

              <div className="hero-logo-core">

                <img
                  src={logoImg}
                  alt="EcoBazaar Logo"
                />

              </div>

            </div>


            {/* BRAND NAME */}

            <div className="hero-brand-name">
              <span>Eco</span>Bazaar
            </div>

            <div className="hero-command">
              COMMAND CENTER
            </div>


            {/* DESCRIPTION */}

            <p className="hero-title">
              Sustainable Shopping.
              <br />
              <strong>Smarter Business.</strong>
            </p>

            <p className="hero-description">
              Manage your EcoBazaar marketplace,
              products, sellers, orders and analytics
              from one powerful command center.
            </p>

            <div className="hero-line"></div>


            {/* =================================================
                FEATURE PANEL
            ================================================= */}

            <div className="admin-features">

              <div className="admin-feature">

                <div className="feature-icon">
                  ♧
                </div>

                <div>
                  <strong>MANAGE</strong>
                  <span>PRODUCTS</span>
                </div>

              </div>


              <div className="feature-divider"></div>


              <div className="admin-feature">

                <div className="feature-icon">
                  ♙
                </div>

                <div>
                  <strong>APPROVE</strong>
                  <span>SELLERS</span>
                </div>

              </div>


              <div className="feature-divider"></div>


              <div className="admin-feature">

                <div className="feature-icon">
                  🛒
                </div>

                <div>
                  <strong>TRACK</strong>
                  <span>ORDERS</span>
                </div>

              </div>


              <div className="feature-divider"></div>


              <div className="admin-feature">

                <div className="feature-icon">
                  ◫
                </div>

                <div>
                  <strong>VIEW</strong>
                  <span>ANALYTICS</span>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            RIGHT LOGIN SECTION
        =================================================== */}

        <section className="admin-login-section">

          <div className="login-card">

            {/* CARD TOP GLOW */}

            <div className="login-card-glow"></div>


            {/* RESTRICTED BADGE */}

            <div className="restricted-badge">

              <span className="shield">
                ♢
              </span>

              <span>
                RESTRICTED ACCESS
              </span>

              <i></i>

            </div>


            {/* LOGIN HEADING */}

            <div className="login-heading">

              <h1>
                Admin <span>Login</span>
              </h1>

              <p>
                Secure access to EcoBazaar
                administrative panel
              </p>

            </div>


            {/* ERROR */}

            {error && (

              <div className="admin-error">

                <div className="error-symbol">
                  !
                </div>

                <div>
                  <strong>
                    AUTHENTICATION FAILED
                  </strong>

                  <p>
                    {error}
                  </p>
                </div>

              </div>

            )}


            {/* FORM */}

            <form
              onSubmit={handleAdminLogin}
              className="admin-login-form"
            >

              {/* EMAIL */}

              <div className="login-field">

                <label>
                  ADMIN EMAIL ADDRESS

                  <span>
                    REQUIRED
                  </span>
                </label>

                <div className="field-box">

                  <div className="field-icon">
                    @
                  </div>

                  <input
                    type="email"
                    name="email"
                    placeholder="admin@ecobazaar.com"
                    value={credentials.email}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="login-field">

                <label>
                  MASTER PASSWORD

                  <span>
                    ENCRYPTED
                  </span>
                </label>

                <div className="field-box">

                  <div className="field-icon">
                    ◈
                  </div>

                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    name="password"
                    placeholder="Enter master password"
                    value={credentials.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? '◉' : '◌'}
                  </button>

                </div>

              </div>


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="admin-login-button"
                disabled={loading}
              >

                <span className="button-shine"></span>

                <span className="button-arrow">
                  {loading ? '◌' : '→'}
                </span>

                <span>
                  {loading
                    ? 'AUTHENTICATING...'
                    : 'UNLOCK ADMIN PORTAL'}
                </span>

                {!loading && (
                  <small>↗</small>
                )}

              </button>

            </form>


            {/* SECURITY INFO */}

            <div className="login-security">

              <div className="security-item">

                <div className="security-icon">
                  🔒
                </div>

                <div>
                  <strong>
                    ENCRYPTED
                  </strong>

                  <span>
                    CONNECTION
                  </span>
                </div>

              </div>


              <div className="security-divider"></div>


              <div className="security-item">

                <div className="security-icon">
                  ♙
                </div>

                <div>
                  <strong>
                    ADMIN ONLY
                  </strong>

                  <span>
                    ACCESS
                  </span>
                </div>

              </div>


              <div className="security-divider"></div>


              <div className="security-item">

                <div className="online-dot"></div>

                <div>
                  <strong>
                    SYSTEM
                  </strong>

                  <span>
                    ONLINE
                  </span>
                </div>

              </div>

            </div>


            {/* RETURN */}

            <button
              type="button"
              className="return-store"
              onClick={() => navigate('/')}
            >
              <span>←</span>
              Return to Public Storefront
            </button>

          </div>

        </section>

      </main>


      {/* =====================================================
          BOTTOM BAR
      ===================================================== */}

      <footer className="admin-footer-bar">

        <div>
          🌿 Green Choices
        </div>

        <span></span>

        <div>
          Better Future
        </div>

        <div className="footer-right">
          ECOBAZAAR ADMIN CORE
          <b>•</b>
          v2.0.99
        </div>

      </footer>

    </div>
  );
};

export default AdminLogin;