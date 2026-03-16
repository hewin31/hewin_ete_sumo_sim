const express = require('express');
const db = require('../db');

const router = express.Router();

// Get reported issues
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT ri.*, u.username as reported_by_name, j.name as junction_name
      FROM reported_issues ri
      LEFT JOIN users u ON ri.reported_by = u.id
      LEFT JOIN junctions j ON ri.junction_id = j.id
      ORDER BY ri.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new issue report
router.post('/', async (req, res) => {
  const { junction_id, issue_type, description, urgency, image_data } = req.body;

  try {
    const { rows } = await db.query(
      "INSERT INTO reported_issues (junction_id, issue_type, description, urgency, image_data) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [junction_id, issue_type, description, urgency, image_data]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update issue status
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const { rows } = await db.query(
      "UPDATE reported_issues SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;