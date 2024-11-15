const express = require('express');
const { pool } = require('./db'); // Import the database pool

const app = express();
app.use(express.json());

// Example route to test the database connection
app.get('/leaderboard', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM leaderboard ORDER BY deaths ASC, damageTaken ASC LIMIT 10');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Database query failed' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));