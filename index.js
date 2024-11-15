const express = require('express');
const { sql, poolPromise } = require('./db');

const app = express();
app.use(express.json());

// POST: Add a new leaderboard entry
app.post('/leaderboard', async (req, res) => {
    const { playerName, deaths, timeTaken, damageTaken } = req.body;
    const query = `
        INSERT INTO Leaderboard (playerName, deaths, timeTaken, damageTaken)
        VALUES (@playerName, @deaths, @timeTaken, @damageTaken)
    `;

    try {
        const pool = await poolPromise;
        await pool
            .request()
            .input('playerName', sql.NVarChar, playerName)
            .input('deaths', sql.Int, deaths)
            .input('timeTaken', sql.Float, timeTaken)
            .input('damageTaken', sql.Int, damageTaken)
            .query(query);

        res.status(201).send('Leaderboard entry added successfully');
    } catch (err) {
        console.error('Error adding leaderboard entry:', err);
        res.status(500).send('Internal server error');
    }
});

// GET: Retrieve the leaderboard
app.get('/leaderboard', async (req, res) => {
    const query = `
        SELECT TOP 10 * FROM Leaderboard
        ORDER BY deaths ASC, damageTaken ASC
    `;

    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        res.send(result.recordset);
    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        res.status(500).send('Internal server error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));