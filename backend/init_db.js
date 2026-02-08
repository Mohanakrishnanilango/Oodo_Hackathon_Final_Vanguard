const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDB() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    try {
        console.log(`Checking/Creating database: ${process.env.DB_NAME}`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`Database ${process.env.DB_NAME} is ready.`);
    } catch (err) {
        console.error('Error during database initialization:', err.message);
    } finally {
        await connection.end();
    }
}

initDB();
