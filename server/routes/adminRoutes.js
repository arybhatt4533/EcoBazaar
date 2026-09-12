const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

// 1. Admin Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const result = await pool.query('SELECT * FROM users WHERE lower(trim(email)) = $1', [normalizedEmail]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    const user = result.rows[0];

    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied. Not an admin.' });
    }

    // Emergency bypass for adminBhatt@gmail.com or normal bcrypt verification
    let isMatch = false;
    if (password === 'admin123' && user.email === 'adminBhatt@gmail.com') {
      isMatch = true; 
    } else if (user.password && user.password.startsWith('$2')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = (password === user.password);
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid password' });
    }

    res.json({
      success: true,
      message: 'Admin logged in successfully',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token: 'admin-mock-token-ecobazaar'
    });

  } catch (err) {
    console.error('Admin Login Error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// 2. Admin Dashboard Stats & Data Route (To fix 0 counts & missing products)
router.get('/dashboard-stats', async (req, res) => {
  try {
    const userCountResult = await pool.query('SELECT COUNT(*) FROM users');
    const productCountResult = await pool.query('SELECT COUNT(*) FROM products');
    
    const productsResult = await pool.query('SELECT * FROM products');
    const usersResult = await pool.query('SELECT id, name, email, role FROM users');

    let totalValue = productsResult.rows.reduce((sum, p) => sum + Number(p.price || 0), 0);

    res.json({
      success: true,
      stats: {
        totalUsers: userCountResult.rows[0].count,
        totalProducts: productCountResult.rows[0].count,
        platformValue: totalValue
      },
      users: usersResult.rows,
      products: productsResult.rows
    });
  } catch (err) {
    console.error('Dashboard Stats Error:', err);
    res.status(500).json({ success: false, error: 'Server error while fetching stats' });
  }
});

module.exports = router;