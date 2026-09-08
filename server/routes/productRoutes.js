const express = require('express');
const router = express.Router();
const { getProducts, addProduct } = require('../controllers/productController');
const upload = require('../middleware/upload'); // Multer configuration wali file

router.get('/', getProducts);
router.post('/', upload.single('image'), addProduct); // Image upload middleware added here

module.exports = router;