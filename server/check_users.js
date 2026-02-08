const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkUsers() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'subscription_db'
    });

    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', ['admin@example.com']);
    console.log(rows);
    await connection.end();
}

checkUsers();
