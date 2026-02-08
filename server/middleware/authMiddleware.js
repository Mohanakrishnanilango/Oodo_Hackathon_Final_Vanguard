const jwt = require('jsonwebtoken');

const db = require('../config/db');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

            const [users] = await db.query('SELECT id, role, sales_person_id FROM users WHERE id = ?', [decoded.id]);
            if (users.length === 0) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            req.user = users[0];
            next();
        } catch (error) {
            console.error('Auth Middleware Error:', error.message);
            console.error('Token received:', token);
            res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
