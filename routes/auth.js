// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');

// User Signup

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, userType,dob } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        user = await User.create({ username, email, password: hashedPassword, userType,dob });
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
        const username=user.username
        const userType=user.userType
        jwt.sign(payload, 'secret_key', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({username, token, userType });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PATCH route to update user profile
router.patch('/profile', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extracted user ID from token
        const { userType } = req.body;
        const allowedFields = {}; // Object to store allowed fields based on userType

        // Check userType and define allowed fields
        if (userType === 'teacher') {
            allowedFields.placeOfWork = req.body.placeOfWork;
            allowedFields.jobProfile = req.body.jobProfile;
            allowedFields.yearOfExperience = req.body.yearOfExperience;
        } else if (userType === 'student') {
            allowedFields.schoolName = req.body.schoolName;
            allowedFields.degree = req.body.degree;
            allowedFields.yearOfCompletion = req.body.yearOfCompletion;
        } else {
            return res.status(400).json({ message: 'Invalid userType' });
        }

        // Find user by ID and update allowed fields
        const user = await User.findByIdAndUpdate(userId, { $set: allowedFields }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User profile updated successfully', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
