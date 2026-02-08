const express = require('express');
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Create Order (Convert Cart to Subscription)
router.post('/', protect, async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Get Cart Items
        const [cartItems] = await connection.query(
            `SELECT c.product_id, c.quantity, p.price, p.name 
             FROM cart c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ?`,
            [req.user.id]
        );

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const recurring_amount = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

        // Create Subscription (Order)
        const [subResult] = await connection.query(
            `INSERT INTO subscriptions (customer_id, plan, status, start_date, recurring_amount, payment_term, sales_person) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [req.user.id, 'Monthly', 'Quotation', new Date(), recurring_amount, 'Immediate Payment', 'Online Shop']
        );
        const subId = subResult.insertId;

        // Insert Subscription Lines
        for (const item of cartItems) {
            await connection.query(
                `INSERT INTO subscription_lines (subscription_id, product_id, quantity, unit_price, subtotal) 
                 VALUES (?, ?, ?, ?, ?)`,
                [subId, item.product_id, item.quantity, item.price, item.price * item.quantity]
            );
        }

        // Auto-create Invoice for Immediate Payment
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 9000) + 1000;
        const invoice_number = `INV-${year}-${random}`;

        await connection.query(
            'INSERT INTO invoices (invoice_number, subscription_id, customer_id, amount, date, due_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [invoice_number, subId, req.user.id, recurring_amount, new Date(), new Date(), 'Draft']
        );

        // Clear Cart
        await connection.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

        await connection.commit();
        res.status(201).json({ message: 'Order created', orderId: subId, invoiceNumber: invoice_number });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        connection.release();
    }
});

// Complete Order (Directly from frontend cart data)
router.post('/complete', protect, async (req, res) => {
    const { items, total, paymentMethod } = req.body;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // 1. Create Subscription
        const [subResult] = await connection.query(
            `INSERT INTO subscriptions (customer_id, plan, status, start_date, recurring_amount, payment_term, sales_person) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [req.user.id, 'Standard', 'Confirmed', new Date(), total, 'Immediate', 'Online Portal']
        );
        const subId = subResult.insertId;

        // 2. Insert Subscription Lines
        for (const item of items) {
            await connection.query(
                `INSERT INTO subscription_lines (subscription_id, product_id, quantity, unit_price, subtotal) 
                 VALUES (?, ?, ?, ?, ?)`,
                [subId, item.productId || 1, item.quantity, item.price, item.price * item.quantity]
            );
        }

        // 3. Create Paid Invoice
        const year = new Date().getFullYear();
        const invoice_number = `INV/${year}/${Math.floor(1000 + Math.random() * 9000)}`;
        const [invResult] = await connection.query(
            `INSERT INTO invoices (invoice_number, subscription_id, customer_id, amount, date, due_date, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [invoice_number, subId, req.user.id, total, new Date(), new Date(), 'Paid']
        );
        const invoiceId = invResult.insertId;

        // 4. Record Payment
        await connection.query(
            `INSERT INTO payments (invoice_id, date, amount, method, status, reference) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [invoiceId, new Date(), total, paymentMethod || 'GPay', 'Success', `TXN-${Date.now()}`]
        );

        await connection.commit();
        res.status(201).json({ message: 'Order completed successfully', orderId: subId });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        connection.release();
    }
});

// Get User Orders
router.get('/', protect, async (req, res) => {
    try {
        const [orders] = await db.query(
            'SELECT * FROM subscriptions WHERE customer_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
