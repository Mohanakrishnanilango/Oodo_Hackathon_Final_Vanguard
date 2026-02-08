const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, company, address, phone, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    try {
        const [userExists] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (userExists.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.query(
            'INSERT INTO users (name, email, password_hash, company, address, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, company || '', address || '', phone || '', role || 'user']
        );

        res.status(201).json({
            id: result.insertId,
            name,
            email,
            token: generateToken(result.insertId),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        // Check for both legacy 'password' and new 'password_hash' column during migration transition
        const storedPassword = user.password_hash || user.password;

        if (storedPassword !== password && !(await bcrypt.compare(password, storedPassword))) {
            if (storedPassword !== password) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get User Profile
router.get('/me', async (req, res) => {
    // Middleware to verify token should be added here
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const [users] = await db.query('SELECT id, name, email, role, phone, company, address FROM users WHERE id = ?', [decoded.id]);
        res.json(users[0]);
    } catch (error) {
        res.status(401).json({ message: 'Not authorized' });
    }
});

// Get All Users (Admin/Staff)
router.get('/users', protect, async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, name, email, role, phone, company, address, sales_person_id FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update User (Admin only - for assignment)
router.put('/users/:id', protect, async (req, res) => {
    const { sales_person_id } = req.body;
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
    }
    try {
        await db.query('UPDATE users SET sales_person_id = ? WHERE id = ?', [sales_person_id, req.params.id]);
        res.json({ message: 'User updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update User Profile
router.put('/profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized' });

    const { name, email, phone, company, address, password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        let query = 'UPDATE users SET name=?, email=?, phone=?, company=?, address=?';
        let params = [name, email, phone, company, address];

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            query += ', password_hash=?';
            params.push(hashedPassword);
        }

        query += ' WHERE id=?';
        params.push(decoded.id);

        await db.query(query, params);

        // Fetch updated user
        const [users] = await db.query('SELECT id, name, email, role, phone, company, address FROM users WHERE id = ?', [decoded.id]);

        res.json(users[0]);
    } catch (error) {
        console.error('Profile Update Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
