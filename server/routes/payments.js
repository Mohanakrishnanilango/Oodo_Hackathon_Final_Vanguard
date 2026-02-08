const express = require('express');
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get All Payments (Admin)
router.get('/', protect, async (req, res) => {
    try {
        const [payments] = await db.query(`
            SELECT p.*, i.invoice_number, u.name as customer_name
            FROM payments p
            JOIN invoices i ON p.invoice_id = i.id
            JOIN users u ON i.customer_id = u.id
            ORDER BY p.date DESC
        `);

        const formattedPayments = payments.map(p => ({
            id: p.reference,
            date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            customer: p.customer_name,
            invoice: p.invoice_number,
            method: p.method,
            amount: `₹${p.amount}`,
            status: p.status === 'Success' ? 'Completed' : p.status
        }));

        res.json(formattedPayments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get My Payments (User)
router.get('/my', protect, async (req, res) => {
    try {
        const [payments] = await db.query(`
            SELECT p.*, i.invoice_number
            FROM payments p
            JOIN invoices i ON p.invoice_id = i.id
            WHERE i.customer_id = ?
            ORDER BY p.date DESC
        `, [req.user.id]);

        const formattedPayments = payments.map(p => ({
            id: p.reference,
            date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            invoice: p.invoice_number,
            method: p.method,
            amount: `₹${p.amount}`,
            status: p.status === 'Success' ? 'Completed' : p.status
        }));

        res.json(formattedPayments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
