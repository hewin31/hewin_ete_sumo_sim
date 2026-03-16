const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('Backend Server is running');
});

// Test DB Connection Route
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ 
      success: true, 
      message: 'Database connected successfully', 
      serverTime: result.rows[0].now 
    });
  } catch (err) {
    console.error('DB Connection Error:', err.message);
    res.status(500).json({ 
      success: false, 
      error: 'Database connection failed', 
      details: err.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
