const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3000;

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware
app.use(express.json());

// Route to get users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM login');
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Route to insert a user
app.post('/users', async (req, res) => {
  const { id, username } = req.body;
  try {
    const result = await pool.query('INSERT INTO login (id, username) VALUES ($1, $2) RETURNING *', [id, username]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
