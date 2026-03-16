const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database Tables
const initDB = async () => {
  try {
    // Traffic History
    await db.query(`
      CREATE TABLE IF NOT EXISTS traffic_history (
        id SERIAL PRIMARY KEY,
        time TEXT NOT NULL,
        density INTEGER DEFAULT 0,
        vehicles INTEGER DEFAULT 0,
        timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Global System Stats
    await db.query(`
      CREATE TABLE IF NOT EXISTS system_stats (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `);

    // Initialize stats if empty
    const { rows } = await db.query("SELECT * FROM system_stats");
    if (rows.length === 0) {
      await db.query("INSERT INTO system_stats (key, value) VALUES ('total_junctions', '24')");
      await db.query("INSERT INTO system_stats (key, value) VALUES ('active_signals', '22')");
      await db.query("INSERT INTO system_stats (key, value) VALUES ('emergency_vehicles', '0')");
      await db.query("INSERT INTO system_stats (key, value) VALUES ('detected_accidents', '0')");
      await db.query("INSERT INTO system_stats (key, value) VALUES ('road_blocks', '0')");
      await db.query("INSERT INTO system_stats (key, value) VALUES ('total_vehicles_detected', '0')");
      await db.query("INSERT INTO system_stats (key, value) VALUES ('overall_congestion', 'Low')");
      console.log("✅ System statistics initialized in DB (Pure Mode)");
    }

  } catch (err) {
    console.error("❌ DB Init Error:", err);
  }
};
initDB();

// --- Traffic Statistics Endpoints ---

// Get System Overview
app.get('/api/stats/overview', async (req, res) => {
  try {
    const { rows } = await db.query("SELECT key, value FROM system_stats");
    const stats = {};
    rows.forEach(row => stats[row.key] = isNaN(row.value) ? row.value : Number(row.value));
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Traffic History for Chart
app.get('/api/stats/history', async (req, res) => {
  try {
    const { rows } = await db.query("SELECT time, density, vehicles FROM traffic_history ORDER BY id DESC LIMIT 10");
    res.json(rows.reverse());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Real-time Statistics from Simulation
app.post('/api/stats/update', async (req, res) => {
  const { current_vehicles, current_density, has_emergency } = req.body;
  
  try {
    // 1. Update Cumulative Total (Representative increment)
    await db.query(`
      UPDATE system_stats SET value = (value::int + $1)::text 
      WHERE key = 'total_vehicles_detected'
    `, [Math.max(1, Math.floor(current_vehicles / 4))]);

    // 2. Classify Congestion
    let congestion = 'Low';
    if (current_density > 70) congestion = 'High';
    else if (current_density > 40) congestion = 'Medium';
    
    await db.query("UPDATE system_stats SET value = $1 WHERE key = 'overall_congestion'", [congestion]);

    // 3. Update Emergency Count if detected
    if (has_emergency) {
        await db.query("UPDATE system_stats SET value = (value::int + 1)::text WHERE key = 'emergency_vehicles'");
    }

    // 4. Add or Update Hourly History Chart (e.g., '15.00')
    const timeNow = new Date();
    const hourlyTime = timeNow.getHours().toString().padStart(2, '0') + '.00';
    
    const existingHour = await db.query("SELECT id FROM traffic_history WHERE time = $1", [hourlyTime]);
    if (existingHour.rows.length > 0) {
        await db.query("UPDATE traffic_history SET vehicles = $1, density = $2 WHERE time = $3", [current_vehicles, current_density, hourlyTime]);
    } else {
        await db.query("INSERT INTO traffic_history (time, density, vehicles) VALUES ($1, $2, $3)", [hourlyTime, current_density, current_vehicles]);
    }

    res.json({ success: true, congestion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
