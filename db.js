const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Render's PostgreSQL URL
    ssl: { rejectUnauthorized: false }          // Required for most hosted databases
});

pool.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to PostgreSQL database');
    }
});

module.exports = { pool };