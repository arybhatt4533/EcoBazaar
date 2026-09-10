import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import Signup from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import SellerUpload from './pages/SellerUpload';
import { CheckoutCart } from './pages/CheckoutCart';

// Security Check Component (Bina login ke page kholne se rokega)
const ProtectedRoute = ({ children, allowedRole }) => {
  const storedUser = localStorage.getItem('user');

  // 1. Agar login hi nahi hai, toh login page par bhej do
  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(storedUser);

  // 2. Agar seller role chahiye par user buyer hai, toh dashboard par bhej do
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard (Public ya jaisa tera flow hai) */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Protected Checkout Route (Koi bhi logged-in user khol sakta hai) */}
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <CheckoutCart />
            </ProtectedRoute>
          } 
        />

        {/* Protected Seller Route (Sirf aur sirf 'seller' role wala hi khol payega) */}
        <Route 
          path="/seller" 
          element={
            <ProtectedRoute allowedRole="seller">
              <SellerUpload />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;