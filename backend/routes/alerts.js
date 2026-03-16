const express = require('express');
const db = require('../db');

const router = express.Router();

// Get all alerts
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM alerts ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new alert
router.post('/', async (req, res) => {
  const { id, location, type, type_color, event_timestamp, status = 'Active' } = req.body;

  try {
    const { rows } = await db.query(
      "INSERT INTO alerts (id, location, type, type_color, event_timestamp, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [id, location, type, type_color, event_timestamp, status]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update alert status
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const { rows } = await db.query(
      "UPDATE alerts SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete alert
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await db.query("DELETE FROM alerts WHERE id = $1", [id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;