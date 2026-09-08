const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',          // Apna PostgreSQL username yahan daalein
  host: 'localhost',
  database: 'EcoBazaar',     // Apni database ka naam
  password: 'Bhatt@arya45', // Apna password yahan daalein
  port: 5432,
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL Database successfully!'))
  .catch(err => console.error('Database connection error:', err.stack));

module.exports = pool;