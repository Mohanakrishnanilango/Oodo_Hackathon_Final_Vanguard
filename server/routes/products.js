const express = require('express');
const db = require('../config/db');

const router = express.Router();

// Get All Products (Public - Active Only / Admin - All)
// Get All Products (Public - Active Only / Admin - All / Staff - Own)
router.get('/', async (req, res) => {
    // Check if user is authenticated (via header token manually if not using middleware here)
    // But since this route is public, we need to handle token if present to identify staff
    let user = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            user = { id: decoded.id, role: decoded.role }; // Role might need DB fetch if not in token, but let's assume token has enough or we treat unknown as public
            // Better: use middleware logic or just decode
        } catch (e) { }
    }

    const isAdminQuery = req.query.admin === 'true';

    try {
        let query = 'SELECT * FROM products';
        let params = [];

        if (isAdminQuery && user) {
            // Admin sees all
            if (user.role === 'admin') {
                // No filter
            } else if (user.role === 'internal_staff') {
                // Staff sees own
                query += ' WHERE created_by = ?';
                params.push(user.id);
            }
        } else {
            // Public (Shop) or unauthenticated
            query += ' WHERE is_active = TRUE';
        }

        query += ' ORDER BY created_at DESC';

        const [products] = await db.query(query, params);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get Single Product
router.get('/:id', async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(products[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

const { protect } = require('../middleware/authMiddleware');

// Create Product (Admin/Staff Only)
router.post('/', protect, async (req, res) => {
    const { name, type, price, cost, description, is_active } = req.body;

    // Optional: Add role check if needed, though protect ensures a valid token
    // If you want strictly Admin: if (req.user.role !== 'admin') return res.status(401)...

    try {
        const [result] = await db.query(
            'INSERT INTO products (name, type, price, cost, description, is_active, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, type, price, cost, description || '', is_active ? 1 : 0, req.user.id]
        );
        res.status(201).json({ id: result.insertId, ...req.body, created_by: req.user.id });
    } catch (error) {
        console.error('Database error during product creation:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update Product
router.put('/:id', protect, async (req, res) => {
    const { name, type, price, cost, description, is_active } = req.body;
    try {
        await db.query(
            'UPDATE products SET name=?, type=?, price=?, cost=?, description=?, is_active=? WHERE id=?',
            [name, type, price, cost, description || '', is_active ? 1 : 0, req.params.id]
        );
        res.json({ message: 'Product updated' });
    } catch (error) {
        console.error('Database error during product update:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete Product
router.delete('/:id', protect, async (req, res) => {
    try {
        await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ message: 'Product removed' });
    } catch (error) {
        console.error('Database error during product deletion:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
