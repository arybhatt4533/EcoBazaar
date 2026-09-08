const pool = require('../db');

exports.placeOrder = async (req, res) => {
  const { user_id, items, total_amount, address, phone } = req.body;
  try {
    const order = await pool.query(
      'INSERT INTO orders (user_id, items, total_amount, address, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, JSON.stringify(items), total_amount, address, phone]
    );
    res.json({ success: true, order: order.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};