const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

// Function to create initial user (if not exists)
const createInitialUser = async () => {
    try {
        let user = await User.findOne({ email: 'amjad@desolint.com' });

        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('123456abc', salt);

            user = new User({
                email: 'amjad@desolint.com',
                password: hashedPassword,
            });

            await user.save();
            console.log('Initial user created');
        }
    } catch (error) {
        console.error('Error creating initial user:', error);
    }
};

// Function to handle user login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
    // Get token from header (Bearer token) and check if exists or not 
    const token = req.header('authorization');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = { createInitialUser, login, authMiddleware };