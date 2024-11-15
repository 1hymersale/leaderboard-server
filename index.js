const express = require('express');
const { pool } = require('./db'); // Assuming you have a db.js file for the PostgreSQL connection
const cors = require('cors');

const app = express();
app.use(cors()); // Allows cross-origin requests
app.use(express.json());

// Endpoint to submit a new leaderboard entry
app.post('/leaderboard', async (req, res) => {
    const { playerName, deaths, timeTaken, damageTaken } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO leaderboard (playername, deaths, timetaken, damagetaken) VALUES ($1, $2, $3, $4) RETURNING *',
            [playerName, deaths, timeTaken, damageTaken]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding leaderboard entry:', error);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Endpoint to retrieve the leaderboard
app.get('/leaderboard', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM leaderboard ORDER BY deaths ASC, damagetaken ASC LIMIT 10'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Database query failed' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));