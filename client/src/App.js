import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import Signup from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import SellerUpload from './pages/SellerUpload'; // Curly braces hata diye kyunki yeh default export hai
import { CheckoutCart } from './pages/CheckoutCart';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ab app khulte hi seedha Dashboard (Store) open hoga */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Baaki saare routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/seller" element={<SellerUpload />} />
        <Route path="/checkout" element={<CheckoutCart />} />
      </Routes>
    </Router>
  );
}

export default App;