const db = require('./config/db');

async function checkSchema() {
    try {
        const [columns] = await db.query('SHOW COLUMNS FROM products');
        console.log('Products Table Columns:', columns.map(c => c.Field));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkSchema();
