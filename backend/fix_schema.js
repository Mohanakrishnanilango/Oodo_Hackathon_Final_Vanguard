const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixSchema() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log(`Checking schema for table 'users' in database '${process.env.DB_NAME}'...`);

        // Check if password column exists and rename it to password_hash if necessary
        const [columns] = await connection.query(`SHOW COLUMNS FROM users`);
        const hasPasswordHash = columns.some(col => col.Field === 'password_hash');
        const hasPassword = columns.some(col => col.Field === 'password');

        if (!hasPasswordHash && hasPassword) {
            console.log("Renaming 'password' column to 'password_hash'...");
            await connection.query(`ALTER TABLE users CHANGE password password_hash VARCHAR(255) NOT NULL`);
            console.log("Column renamed successfully.");
        } else if (!hasPasswordHash && !hasPassword) {
            console.log("Creating 'password_hash' column...");
            await connection.query(`ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NOT NULL AFTER email`);
            console.log("Column created successfully.");
        } else {
            console.log("'password_hash' column already exists.");
        }

        // Also ensure 'role' enum is correct
        console.log("Ensuring 'role' enum includes 'internal_staff'...");
        await connection.query(`ALTER TABLE users MODIFY COLUMN role ENUM('user', 'admin', 'internal_staff') NOT NULL DEFAULT 'user'`);

        // Fix password_resets table
        console.log(`Checking schema for table 'password_resets' in database '${process.env.DB_NAME}'...`);
        const [resetColumns] = await connection.query(`SHOW COLUMNS FROM password_resets`);
        const hasUserId = resetColumns.some(col => col.Field === 'user_id');

        if (!hasUserId) {
            console.log("Recreating 'password_resets' table to match required schema...");
            // Drop old table if it's the legacy version (email/token)
            await connection.query(`DROP TABLE IF EXISTS password_resets`);
            await connection.query(`
                CREATE TABLE IF NOT EXISTS password_resets (
                  id INT AUTO_INCREMENT PRIMARY KEY,
                  user_id INT NOT NULL,
                  otp_hash VARCHAR(255) NOT NULL,
                  expires_at DATETIME NOT NULL,
                  used TINYINT(1) NOT NULL DEFAULT 0,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  CONSTRAINT fk_password_resets_user
                    FOREIGN KEY (user_id) REFERENCES users(id)
                    ON DELETE CASCADE
                )
            `);
            console.log("Table 'password_resets' recreated successfully.");
        } else {
            console.log("'user_id' column already exists in 'password_resets'.");
        }

        console.log("Schema fix complete.");
    } catch (err) {
        console.error('Error fixing schema:', err.message);
    } finally {
        await connection.end();
    }
}

fixSchema();
