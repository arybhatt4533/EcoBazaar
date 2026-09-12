const pool = require('../db');

// Get All Products (with optional seller filter)
exports.getProducts = async (req, res) => {
  try {
    const sellerId = req.query.seller_id;
    let query = 'SELECT * FROM products ORDER BY id DESC';
    let values = [];

    if (sellerId) {
      query = 'SELECT * FROM products WHERE seller_id = $1 ORDER BY id DESC';
      values = [sellerId];
    }

    const products = await pool.query(query, values);
    res.json(products.rows);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Add Product
exports.addProduct = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ success: false, error: "Request body is missing" });
    }

    const { 
      brand = '', 
      title = '', 
      category = '', 
      price = 0, 
      offer_price = null, 
      sizes = '', 
      description = '', 
      specifications = '', 
      seller_id = 1 
    } = req.body;
    
    // Handle image path from multer upload
    const imagePath = req.file ? `uploads/${req.file.filename}` : (req.body.image_url || '');

    const query = `
      INSERT INTO products 
      (brand, title, category, price, offer_price, sizes, image, description, specifications, seller_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *
    `;

    const values = [
      brand, 
      title, 
      category, 
      price, 
      offer_price || null, 
      sizes, 
      imagePath, 
      description, 
      specifications, 
      seller_id
    ];

    const newProduct = await pool.query(query, values);
    res.status(201).json({ success: true, product: newProduct.rows[0] });

  } catch (err) {
    console.error("Database Insert Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update / Edit Product
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { 
      brand = '', 
      title = '', 
      category = '', 
      price = 0, 
      offer_price = null, 
      sizes = '', 
      description = '', 
      specifications = '' 
    } = req.body;

    // Check if product exists and get old image
    const existing = await pool.query('SELECT image FROM products WHERE id = $1', [productId]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    // Agar nayi image upload ki hai toh wo use karo, nahi toh purani wali rehne do
    const imagePath = req.file ? `uploads/${req.file.filename}` : existing.rows[0].image;

    const query = `
      UPDATE products 
      SET brand = $1, title = $2, category = $3, price = $4, offer_price = $5, 
          sizes = $6, image = $7, description = $8, specifications = $9
      WHERE id = $10 
      RETURNING *
    `;

    const values = [
      brand, 
      title, 
      category, 
      price, 
      offer_price || null, 
      sizes, 
      imagePath, 
      description, 
      specifications, 
      productId
    ];

    const updatedProduct = await pool.query(query, values);
    res.json({ success: true, product: updatedProduct.rows[0], message: "Product updated successfully!" });

  } catch (err) {
    console.error("Database Update Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [productId]);

    if (deletedProduct.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted successfully!" });

  } catch (err) {
    console.error("Database Delete Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};