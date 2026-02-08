const db = require('./config/db');

async function migrate() {
    try {
        const connection = await db.getConnection();
        console.log('Checking if created_by column exists in products table...');

        const [columns] = await connection.query("SHOW COLUMNS FROM products LIKE 'created_by'");

        if (columns.length === 0) {
            console.log('Adding created_by column...');
            await connection.query("ALTER TABLE products ADD COLUMN created_by INT DEFAULT NULL");
            console.log('Column added successfully.');
        } else {
            console.log('Column created_by already exists.');
        }

        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
