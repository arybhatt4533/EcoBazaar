import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children, allowedRole }) => {
  const storedUser = localStorage.getItem('user');

  // 1. Agar user logged in hi nahi hai, toh login page par bhej do
  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(storedUser);

  // 2. Agar koi specific role required hai (jaise 'seller') aur user ka role wo nahi hai
  if (allowedRole && user.role !== allowedRole) {
    // Agar buyer seller page kholne ki koshish kare, toh usko buyer dashboard ya home pe bhej do
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Sab kuch theek hai toh component render hone do
  return children;
};