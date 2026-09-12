import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/brand.png';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', credentials);

      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);
        localStorage.setItem('adminUser', JSON.stringify(res.data.user));
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Access Denied: Invalid Admin Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-badge">
          <span>🛡️ RESTRICTED ACCESS</span>
        </div>

        <div className="admin-brand">
          <img src={logoImg} alt="EcoBazaar Logo" />
          <h2>EcoBazaar Command Center</h2>
          <p>Login with adminBhatt@gmail.com</p>
        </div>

        {error && <div className="admin-error-alert">⚠️ {error}</div>}

        <form onSubmit={handleAdminLogin} className="admin-form">
          <div className="admin-input-group">
            <label>Admin Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="adminBhatt@gmail.com"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-input-group">
            <label>Master Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••••••"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="admin-submit-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Unlock Admin Portal 🚀'}
          </button>
        </form>

        <div className="admin-footer">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            ← Return to Public Storefront
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;