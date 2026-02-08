const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function migrateSchema() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'subscription_db'
        });

        console.log('--- Migrating Schema: Adding sales_person_id to users ---');

        // Check if column exists
        const [columns] = await connection.query("SHOW COLUMNS FROM users LIKE 'sales_person_id'");
        if (columns.length === 0) {
            await connection.query(`
                ALTER TABLE users
                ADD COLUMN sales_person_id INT NULL,
                ADD CONSTRAINT fk_users_sales_person
                FOREIGN KEY (sales_person_id) REFERENCES users(id)
                ON DELETE SET NULL
            `);
            console.log('Added sales_person_id column and foreign key.');
        } else {
            console.log('Column sales_person_id already exists.');
        }

        // Also ensure internal_staff role exists in enum if not (ENUMs are tricky to update safely without downtime, but for this Hackathon/Dev env it's fine)
        // My schema dump showed role ENUM('user','admin','internal_staff'), so we are good there.

    } catch (err) {
        console.error('Migration failed:', err.message);
    } finally {
        if (connection) await connection.end();
    }
}

migrateSchema();
