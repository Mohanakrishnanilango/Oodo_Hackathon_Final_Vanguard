const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from server directory
dotenv.config({ path: path.join(__dirname, '.env') });

const fs = require('fs');

async function dumpSchema() {
    let connection;
    let logStream = fs.createWriteStream('schema_audit.log');
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'subscription_db'
        });

        logStream.write(`--- Schema Dump for ${process.env.DB_NAME} ---\n`);

        const tables = ['users', 'products', 'invoices', 'subscriptions', 'subscription_lines'];

        for (const table of tables) {
            const [columns] = await connection.query(`DESCRIBE ${table}`);
            logStream.write(`Table_${table}: ${JSON.stringify(columns)}\n`);
        }
        console.log("Schema dumped to schema_audit.log");

    } catch (err) {
        logStream.write(`Error dumping schema: ${err.message}\n`);
        console.error('Error dumping schema:', err.message);
    } finally {
        if (connection) await connection.end();
        logStream.end();
    }
}

dumpSchema();
