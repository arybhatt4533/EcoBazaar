const express = require('express');
const router = express.Router();
const pool = require('../db');

// Check User Address Route
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const query = 'SELECT * FROM user_addresses WHERE user_id = $1';
        const result = await pool.query(query, [userId]);
        
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Get Address Error:', err.message);
        res.status(500).json({ success: false, error: 'Server error while fetching address' });
    }
});

// Save New Address Route
router.post('/', async (req, res) => {
    try {
        const { user_id, address, city, pincode, phone } = req.body;
        
        const query = `
            INSERT INTO user_addresses (user_id, address, city, pincode, phone)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [user_id, address, city, pincode, phone];
        const newAddress = await pool.query(query, values);
        
        res.status(201).json({ 
            success: true, 
            message: 'Address saved successfully', 
            address: newAddress.rows[0] 
        });
    } catch (err) {
        console.error('Save Address Error:', err.message);
        res.status(500).json({ success: false, error: 'Server error while saving address' });
    }
});

module.exports = router;