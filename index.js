const express = require('express');
const { pool } = require('./db'); // Assuming you have a db.js file for the PostgreSQL connection
const cors = require('cors');

const app = express();
app.use(cors()); // Allows cross-origin requests
app.use(express.json());

// Endpoint to submit a new leaderboard entry
app.post('/leaderboard', async (req, res) => {
    const { playername, deaths, timetaken, damagetaken, map } = req.body;

    if (!map) {
        return res.status(400).send({ error: 'Map is required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO leaderboard (playername, deaths, timetaken, damagetaken, map) VALUES ($1, $2, $3, $4, $5)',
            [playername, deaths, timetaken, damagetaken, map]
        );
        res.status(201).send(result.rows);
    } catch (error) {
        console.error('Error inserting leaderboard entry:', error);
        res.status(500).send({ error: 'Database error' });
    }
});

// Endpoint to retrieve the leaderboard
app.get('/leaderboard', async (req, res) => {
    const { map } = req.query;

    if (!map) {
        return res.status(400).send({ error: 'Map is required' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM leaderboard WHERE map = $1 ORDER BY deaths ASC, damagetaken ASC LIMIT 10',
            [map]
        );
        res.send(result.rows);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).send({ error: 'Database error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));