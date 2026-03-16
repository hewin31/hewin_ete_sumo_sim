const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Import route modules
const authRoutes = require('./routes/auth');
const alertsRoutes = require('./routes/alerts');
const issuesRoutes = require('./routes/issues');
const signalsRoutes = require('./routes/signals');

// Routes
app.use('/api/auth', authRoutes.router);
app.use('/api/alerts', alertsRoutes);
app.use('/api/issues', issuesRoutes);
app.use('/api/signals', signalsRoutes);

// Initialize Database Tables
const initDB = async () => {
  try {
    console.log("🔄 Starting database initialization...");
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

    // Users table for authentication
    console.log("Creating users table...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'operator',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMPTZ
      )
    `);
    console.log("✅ Users table created");

    // Junctions table
    await db.query(`
      CREATE TABLE IF NOT EXISTS junctions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        status TEXT DEFAULT 'Normal',
        status_color TEXT DEFAULT 'green',
        density INTEGER DEFAULT 0,
        vehicle_count INTEGER DEFAULT 0,
        signal_state TEXT DEFAULT 'Green',
        timer INTEGER DEFAULT 30,
        emergency BOOLEAN DEFAULT false,
        accident BOOLEAN DEFAULT false,
        coordinates JSONB,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Alerts table
    await db.query(`
      CREATE TABLE IF NOT EXISTS alerts (
        id TEXT PRIMARY KEY,
        location TEXT NOT NULL,
        type TEXT NOT NULL,
        type_color TEXT NOT NULL,
        event_timestamp TEXT NOT NULL,
        status TEXT DEFAULT 'Active',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Reported Issues table
    await db.query(`
      CREATE TABLE IF NOT EXISTS reported_issues (
        id SERIAL PRIMARY KEY,
        junction_id TEXT NOT NULL,
        issue_type TEXT NOT NULL,
        description TEXT NOT NULL,
        urgency TEXT NOT NULL,
        image_data TEXT,
        status TEXT DEFAULT 'Queued',
        reported_by INTEGER REFERENCES users(id),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure image_data column exists (for existing tables)
    await db.query(`ALTER TABLE reported_issues ADD COLUMN IF NOT EXISTS image_data TEXT`);

    // Signal overrides table
    await db.query(`
      CREATE TABLE IF NOT EXISTS signal_overrides (
        id SERIAL PRIMARY KEY,
        junction_id TEXT NOT NULL,
        direction TEXT NOT NULL,
        color TEXT NOT NULL,
        timer INTEGER DEFAULT 0,
        override_type TEXT DEFAULT 'manual',
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
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

    // Initialize default user
    const userCount = await db.query("SELECT COUNT(*) FROM users");
    if (parseInt(userCount.rows[0].count) === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.query(
        "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)",
        ['admin', 'admin@roadzen.ai', hashedPassword, 'operator']
      );
      console.log("✅ Default admin user created (admin@roadzen.ai / admin123)");
    }

    // Initialize default junctions
    const junctionCount = await db.query("SELECT COUNT(*) FROM junctions");
    if (parseInt(junctionCount.rows[0].count) === 0) {
      const defaultJunctions = [
        {
          id: "J-001",
          name: "Main St & 5th Ave",
          status: "Heavy Traffic",
          status_color: "orange",
          density: 75,
          vehicle_count: 120,
          signal_state: "Red",
          timer: 25,
          emergency: false,
          accident: false,
          coordinates: { x: 10, y: 20 }
        },
        {
          id: "J-002",
          name: "Broadway & Park Row",
          status: "Smooth Traffic",
          status_color: "green",
          density: 20,
          vehicle_count: 35,
          signal_state: "Green",
          timer: 45,
          emergency: false,
          accident: false,
          coordinates: { x: 30, y: 40 }
        },
        {
          id: "J-003",
          name: "Empire Blvd & Flatbush",
          status: "Severe Congestion",
          status_color: "red",
          density: 95,
          vehicle_count: 210,
          signal_state: "Red",
          timer: 10,
          emergency: false,
          accident: true,
          coordinates: { x: 50, y: 60 }
        },
        {
          id: "J-004",
          name: "Lexington Ave & 42nd St",
          status: "Moderate Traffic",
          status_color: "yellow",
          density: 45,
          vehicle_count: 85,
          signal_state: "Yellow",
          timer: 5,
          emergency: true,
          accident: false,
          coordinates: { x: 70, y: 80 }
        },
        {
          id: "J-005",
          name: "Madison Ave & 59th St",
          status: "Road Block",
          status_color: "black",
          density: 100,
          vehicle_count: 0,
          signal_state: "Red",
          timer: 0,
          emergency: false,
          accident: false,
          coordinates: { x: 90, y: 100 }
        }
      ];

      for (const junction of defaultJunctions) {
        await db.query(`
          INSERT INTO junctions (id, name, status, status_color, density, vehicle_count, signal_state, timer, emergency, accident, coordinates)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          junction.id, junction.name, junction.status, junction.status_color,
          junction.density, junction.vehicle_count, junction.signal_state,
          junction.timer, junction.emergency, junction.accident, JSON.stringify(junction.coordinates)
        ]);
      }
      console.log("✅ Default junctions initialized");
    }

    // Initialize default alerts
    const alertCount = await db.query("SELECT COUNT(*) FROM alerts");
    if (parseInt(alertCount.rows[0].count) === 0) {
      const defaultAlerts = [
        {
          id: "A-101",
          location: "Empire Blvd & Flatbush",
          type: "Accident",
          type_color: "purple",
          event_timestamp: "2026-03-16 11:30 AM",
          status: "Active"
        },
        {
          id: "A-102",
          location: "Lexington Ave & 42nd St",
          type: "Emergency Vehicle",
          type_color: "blue",
          event_timestamp: "2026-03-16 11:40 AM",
          status: "Active"
        },
        {
          id: "A-103",
          location: "Madison Ave & 59th St",
          type: "Road Block",
          type_color: "black",
          event_timestamp: "2026-03-16 09:15 AM",
          status: "Resolved"
        }
      ];

      for (const alert of defaultAlerts) {
        await db.query(`
          INSERT INTO alerts (id, location, type, type_color, event_timestamp, status)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [alert.id, alert.location, alert.type, alert.type_color, alert.event_timestamp, alert.status]);
      }
      console.log("✅ Default alerts initialized");
    }

  } catch (err) {
    console.error("❌ DB Init Error:", err);
  }
};

// Initialize DB and start server
const startServer = async () => {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  }
};

startServer();

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
