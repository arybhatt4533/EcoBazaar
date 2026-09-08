const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(express.json());
app.use(cors());
// server.js ke andar app.use(cors()); ke baad ye line jodh dena:
app.use('/uploads', express.static('uploads'));

// Registering Modular Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Professional MVC Server running on port ${PORT}`);
});