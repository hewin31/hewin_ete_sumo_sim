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
      await db.query("INSERT INTO system_stats (key, value) VALUES ('detected_accidents', '1')");
      await db.query("INSERT INTO system_stats (key, value) VALUES ('road_blocks', '1')");
      await db.query("INSERT INTO system_stats (key, value) VALUES ('total_vehicles_detected', '0')");
      console.log("✅ System statistics initialized in DB");
    }

    // Insert mock chart data if empty
    const chartRows = await db.query("SELECT * FROM traffic_history");
    if (chartRows.rows.length === 0) {
        const mockData = [
            ['08:00', 40, 400], ['09:00', 85, 850], ['10:00', 65, 650],
            ['11:00', 75, 750], ['12:00', 55, 550], ['13:00', 45, 450], ['14:00', 50, 500]
        ];
        for (const [time, density, vehicles] of mockData) {
            await db.query("INSERT INTO traffic_history (time, density, vehicles) VALUES ($1, $2, $3)", [time, density, vehicles]);
        }
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
    // 1. Update Cumulative Total
    await db.query(`
      INSERT INTO system_stats (key, value) 
      VALUES ('total_vehicles_detected', $1)
      ON CONFLICT (key) DO UPDATE SET value = (system_stats.value::int + $1)::text
    `, [current_vehicles]);

    // 2. Update Emergency Count if detected
    if (has_emergency) {
        await db.query("UPDATE system_stats SET value = (value::int + 1)::text WHERE key = 'emergency_vehicles'");
    }

    // 3. Add to History Chart (Simple grouping: one entry per minute/update)
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    await db.query(
        "INSERT INTO traffic_history (time, density, vehicles) VALUES ($1, $2, $3)",
        [timeNow, current_density, current_vehicles]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
