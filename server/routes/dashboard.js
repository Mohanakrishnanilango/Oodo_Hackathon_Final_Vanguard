const express = require('express');
const db = require('../config/db');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

// Get Dashboard Stats
router.get('/stats', protect, async (req, res) => {
    try {
        let subsQuery = "SELECT COUNT(*) as count FROM subscriptions WHERE status IN ('In Progress', 'Confirmed')";
        let invsQuery = "SELECT COUNT(*) as count FROM invoices WHERE status = 'Draft' OR status = 'Sent'";
        let paymentsQuery = "SELECT SUM(amount) as total FROM payments WHERE date = ?";
        let params = [];
        let paymentParams = [new Date().toISOString().split('T')[0]];

        if (req.user.role === 'internal_staff') {
            // Filter by subscriptions assigned to this staff or customers assigned to this staff?
            // Subscriptions have sales_person field but it's text "Online Shop" etc.
            // Better to join with users/customers? 
            // Or use the newly implemented logic where customers are assigned to staff.

            // Let's filter by subscriptions where customer's sales_person_id is me.
            // Or if subscriptions table has sales_person_id (it doesn't, it has sales_person text).
            // But we can join with users table on customer_id.

            subsQuery = `
                SELECT COUNT(s.id) as count 
                FROM subscriptions s 
                JOIN users u ON s.customer_id = u.id 
                WHERE s.status IN ('In Progress', 'Confirmed') AND u.sales_person_id = ?`;

            invsQuery = `
                SELECT COUNT(i.id) as count 
                FROM invoices i 
                JOIN users u ON i.customer_id = u.id 
                WHERE (i.status = 'Draft' OR i.status = 'Sent') AND u.sales_person_id = ?`;

            // Payments linked to invoices, linked to customers
            paymentsQuery = `
                SELECT SUM(p.amount) as total 
                FROM payments p
                JOIN invoices i ON p.invoice_id = i.id
                JOIN users u ON i.customer_id = u.id
                WHERE p.date = ? AND u.sales_person_id = ?`;

            params = [req.user.id];
            paymentParams.push(req.user.id);
        }

        const [subs] = await db.query(subsQuery, params);
        const [invs] = await db.query(invsQuery, params);
        const [payments] = await db.query(paymentsQuery, paymentParams);

        res.json({
            activeSubscriptions: subs[0].count,
            pendingInvoices: invs[0].count,
            todaysCollections: payments[0].total || 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get Recent Activity
router.get('/activity', protect, async (req, res) => {
    try {
        let query;
        let params = [];

        if (req.user.role === 'internal_staff') {
            query = `
                SELECT 'Subscription' as type, s.plan as description, s.created_at as date, u.name as customer
                FROM subscriptions s
                JOIN users u ON s.customer_id = u.id
                WHERE u.sales_person_id = ?
                UNION ALL
                SELECT 'Invoice' as type, i.invoice_number as description, i.date as date, u.name as customer
                FROM invoices i
                JOIN users u ON i.customer_id = u.id
                WHERE u.sales_person_id = ?
                ORDER BY date DESC
                LIMIT 5
             `;
            params = [req.user.id, req.user.id];
        } else {
            // Admin sees all
            query = `
                SELECT 'Subscription' as type, s.plan as description, s.created_at as date, u.name as customer
                FROM subscriptions s
                JOIN users u ON s.customer_id = u.id
                UNION ALL
                SELECT 'Invoice' as type, i.invoice_number as description, i.date as date, u.name as customer
                FROM invoices i
                JOIN users u ON i.customer_id = u.id
                ORDER BY date DESC
                LIMIT 5
             `;
        }

        const [activity] = await db.query(query, params);
        res.json(activity);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
