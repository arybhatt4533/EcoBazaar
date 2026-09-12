const pool = require('../db');

// 1. Admin Login Controller
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userQuery.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Admin account not found!" });
    }

    const user = userQuery.rows[0];

    // Password check (agar plain text ya hashed hai uske mutabiq)
    if (user.password !== password) {
      return res.status(400).json({ success: false, message: "Invalid admin password!" });
    }

    // Role check (agar database me role column hai)
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Access Denied: You are not an Admin!" });
    }

    res.json({
      success: true,
      message: "Admin Login Successful!",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token: "admin-secret-token"
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. Get Platform Stats (Total Users, Total Products, Revenue)
const getAdminStats = async (req, res) => {
  try {
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    const productsCount = await pool.query('SELECT COUNT(*) FROM products');
    const revenueQuery = await pool.query('SELECT SUM(price) as total_revenue FROM products');

    res.json({
      success: true,
      stats: {
        totalUsers: usersCount.rows[0].count,
        totalProducts: productsCount.rows[0].count,
        totalRevenue: revenueQuery.rows[0].total_revenue || 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 3. Get All Users List
const getAllUsers = async (req, res) => {
  try {
    const users = await pool.query('SELECT id, name, email, role FROM users ORDER BY id DESC');
    res.json(users.rows);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 4. Delete User by Admin
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    res.json({ success: true, message: "User deleted successfully by Admin!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  adminLogin,
  getAdminStats,
  getAllUsers,
  deleteUser
};