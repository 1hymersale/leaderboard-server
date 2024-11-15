const express = require('express');
const Database = require('@replit/database');

const app = express();
const db = new Database();
app.use(express.json());

// POST endpoint to add a new leaderboard entry
app.post('/leaderboard', async (req, res) => {
    const { playerName, deaths, timeTaken, damageTaken } = req.body;
    const entry = { playerName, deaths, timeTaken, damageTaken };
    await db.set(playerName, entry);
    res.status(201).send(entry);
});

// GET endpoint to retrieve the leaderboard
app.get('/leaderboard', async (req, res) => {
    const entries = await db.getAll();
    const sortedEntries = Object.values(entries)
        .sort((a, b) => a.deaths - b.deaths || a.damageTaken - b.damageTaken)
        .slice(0, 10);
    res.send(sortedEntries);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));