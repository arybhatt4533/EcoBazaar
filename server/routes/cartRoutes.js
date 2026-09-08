const express = require('express');
const router = express.Router();
const pool = require('../db'); // Tera database connection pool

// Add to Cart Route
router.post('/', async (req, res) => {
    try {
        const { user_id, product_id, title, price, image } = req.body;
        
        const query = `
            INSERT INTO cart_items (user_id, product_id, title, price, image)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [user_id, product_id, title, price, image];
        const newCartItem = await pool.query(query, values);
        
        res.status(201).json({ 
            success: true, 
            message: 'Item added to cart successfully', 
            item: newCartItem.rows[0] 
        });
    } catch (err) {
        console.error('Cart Error:', err.message);
        res.status(500).json({ success: false, error: 'Server error while adding to cart' });
    }
});

module.exports = router;