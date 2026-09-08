const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', registerUser); // Yeh endpoint banega -> /api/auth/register
router.post('/login', loginUser);       // Yeh endpoint banega -> /api/auth/login

module.exports = router;