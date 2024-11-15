const express = require('express');
const { pool } = require('./db'); // Import the database pool
const cors = require('cors'); // Import CORS middleware

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable JSON body parsing

// Endpoint to fetch leaderboard entries
app.get('/leaderboard', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM leaderboard ORDER BY deaths ASC, damage_taken ASC LIMIT 10');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Endpoint to submit a new leaderboard entry
app.post('/leaderboard', async (req, res) => {
    const { playerName, deaths, timeTaken, damageTaken } = req.body;

    try {
        const query = 'INSERT INTO leaderboard (player_name, deaths, time_taken, damage_taken) VALUES ($1, $2, $3, $4)';
        await pool.query(query, [playerName, deaths, timeTaken, damageTaken]);
        res.status(201).json({ success: true, message: 'Entry added successfully' });
    } catch (error) {
        console.error('Error adding leaderboard entry:', error);
        res.status(500).json({ error: 'Failed to add entry' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));