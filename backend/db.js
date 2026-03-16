const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/smarttraffic',
  ssl: process.env.DATABASE_URL ? {
    rejectUnauthorized: false
  } : false,
  max: 10,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 30000,
  acquireTimeoutMillis: 60000,  statement_timeout: 60000,
  query_timeout: 60000,});

pool.on('connect', () => {
  console.log('✅ Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  // Don't exit process, just log the error
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
