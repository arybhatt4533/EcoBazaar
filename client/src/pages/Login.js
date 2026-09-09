import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer'); // Default role buyer rahega
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        // Backend role ya selected role ke mutabiq redirect karo
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
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>🛒 EcoBazaar</h2>
          <p>Welcome Back! Please login to continue.</p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="role-switch-container">
          <button 
            type="button"
            className={`role-tab ${role === 'buyer' ? 'active-role' : ''}`}
            onClick={() => setRole('buyer')}
          >
            Buyer
          </button>
          <button 
            type="button"
            className={`role-tab ${role === 'seller' ? 'active-role' : ''}`}
            onClick={() => setRole('seller')}
          >
            Seller
          </button>
        </div>

        <form onSubmit={handleAuth} className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="submit-btn">
            {role === 'seller' ? 'Login as Seller' : 'Login to Account'}
          </button>
        </form>

        <p className="auth-redirect">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;