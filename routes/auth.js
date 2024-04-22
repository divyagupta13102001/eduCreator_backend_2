// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// User Signup

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, userType,yearOfCompletion,dob,degree,schoolName} = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        user = await User.create({ username, email, password: hashedPassword, userType,yearOfCompletion,dob,degree,schoolName });
        await user.save();
        const payload = {
            user: {
                id: user._id
            }
        };

        jwt.sign(payload, 'yoursecrettoken', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ message: 'User registered successfully', token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        const username=user.username
        const userType=user.userType
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const payload = {
            user: {
                id: user._id,
                userType: user.userType
            }
        };

        jwt.sign(payload, 'secret_key', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({username, token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
