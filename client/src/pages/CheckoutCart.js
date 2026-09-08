import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const CheckoutCart = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignup, setIsSignup] = useState(true); // Toggle between Signup / Login
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      // Agar user logged in nahi hai, toh auth modal khol do
      setShowAuthModal(true);
    } else {
      // Logged in hai toh order process karo
      placeOrder();
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSignup ? '/api/auth/register' : '/api/auth/login';
      const payload = isSignup ? { name, email, password, role: 'buyer' } : { email, password };
      
      const res = await axios.post(`http://localhost:5000${endpoint}`, payload);
      
      // Data save karke user ko logged in maan lo
      const userData = res.data.user;
      localStorage.setItem('user', JSON.stringify(userData));
      
      setShowAuthModal(false);
      alert('Authentication successful! Proceeding with your order.');
      placeOrder();
    } catch (err) {
      alert(err.response?.data?.error || 'Authentication failed');
    }
  };

  const placeOrder = () => {
    // Yahan order placement ka API call aayega
    alert('Order placed successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      {/* Cart items list yahan hogi */}
      
      <button className="checkout-btn" onClick={handleCheckoutClick}>
        Proceed to Checkout
      </button>

      {/* Checkout ke waqt khulne wala Popup / Modal */}
      {showAuthModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>{isSignup ? 'Create Account to Complete Order' : 'Login to Complete Order'}</h3>
            <form onSubmit={handleAuthSubmit}>
              {isSignup && (
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              )}
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <button type="submit" className="submit-btn">
                {isSignup ? 'Sign Up & Place Order' : 'Login & Place Order'}
              </button>
            </form>

            <p style={{ marginTop: '10px', textAlign: 'center', cursor: 'pointer', color: '#2c5e3b' }} 
               onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </p>
            
            <button className="close-btn" onClick={() => setShowAuthModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};