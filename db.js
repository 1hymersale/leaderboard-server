const sql = require('mssql');

const config = {
    user: 'sa',               // Your SQL Server username
    password: 'your_password', // Your SQL Server password
    server: 'localhost',      // Your server address (use 'localhost' for local setup)
    database: 'Leaderboard',  // Your database name
    options: {
        encrypt: false,       // Disable encryption for local connections
        trustServerCertificate: true, // Required for some local SQL Server setups
    },
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then((pool) => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch((err) => {
        console.error('Database Connection Failed:', err);
    });

module.exports = { sql, poolPromise };