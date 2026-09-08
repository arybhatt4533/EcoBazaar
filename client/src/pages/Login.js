import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

export const Login = () => {
  const [isSeller, setIsSeller] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    const role = isSeller ? 'seller' : 'buyer';
    try {
      // Backend ke alag login route ke sath connect kiya
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        if (res.data.user.role === 'seller' || role === 'seller') {
          navigate('/seller');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Authentication failed. Please check details.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>EcoBazaar</h2>
          <p>{isSeller ? 'Seller Portal Login' : 'Welcome Back, Shopper!'}</p>
        </div>

        <div className="role-switch">
          <button 
            type="button"
            className={!isSeller ? 'active-tab' : ''} 
            onClick={() => setIsSeller(false)}
          >
            Buyer
          </button>
          <button 
            type="button"
            className={isSeller ? 'active-tab' : ''} 
            onClick={() => setIsSeller(true)}
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
            {isSeller ? 'Login as Seller' : 'Login to Store'}
          </button>
        </form>

        {/* Signup page redirect link using Login.css class */}
        <p className="auth-redirect">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};