const pool = require('../db');

// 1. Register Function (Sign up ke liye)
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Check karo ki email pehle se registered toh nahi hai
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists with this email.' });
        }

        // Naye user ko database mein save karo
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, password, role || 'buyer']
        );

        res.status(201).json({ message: 'Registration successful', user: newUser.rows[0] });
    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

// 2. Login Function (Existing data match karne ke liye)
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Database se check karo ki email aur password match ho rahe hain ya nahi
        const user = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
        
        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        res.status(200).json({ message: 'Login successful', user: user.rows[0] });
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ error: 'Server error during login' });
    }
};