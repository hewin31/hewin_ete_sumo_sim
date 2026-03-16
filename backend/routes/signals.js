const express = require('express');
const db = require('../db');

const router = express.Router();

// Get junctions
router.get('/junctions', async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM junctions ORDER BY id");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get signal overrides for a junction
router.get('/:junctionId', async (req, res) => {
  const { junctionId } = req.params;

  try {
    const { rows } = await db.query(
      "SELECT * FROM signal_overrides WHERE junction_id = $1 ORDER BY created_at DESC LIMIT 4",
      [junctionId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create signal override
router.post('/override', async (req, res) => {
  const { junction_id, overrides } = req.body; // overrides should be array of {direction, color, timer}

  try {
    const insertedOverrides = [];

    for (const override of overrides) {
      const { rows } = await db.query(
        "INSERT INTO signal_overrides (junction_id, direction, color, timer) VALUES ($1, $2, $3, $4) RETURNING *",
        [junction_id, override.direction, override.color, override.timer || 0]
      );
      insertedOverrides.push(rows[0]);
    }

    res.status(201).json({ overrides: insertedOverrides });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update junction data
router.put('/junction/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Build dynamic update query
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');

    const { rows } = await db.query(
      `UPDATE junctions SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Junction not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;