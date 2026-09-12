const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    addProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');
const upload = require('../middleware/upload'); // Multer configuration wali file

// Existing routes
router.get('/', getProducts);
router.post('/', upload.single('image'), addProduct);

// New Routes for Seller Edit & Delete
router.put('/:id', upload.single('image'), updateProduct); // Product update karne ke liye (agar image bhi change karni ho)
router.delete('/:id', deleteProduct); // Product delete karne ke liye

module.exports = router;