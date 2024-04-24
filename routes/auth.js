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
        const { username, email, password, userType, dob, schoolName, degree, yearOfCompletion,yearOfExperience,
            jobProfile,
            placeOfWork, } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        if (userType === 'student') {
            user = await User.create({ 
                username, 
                email, 
                password: hashedPassword, 
                userType, 
                dob, 
                schoolName, 
                degree, 
                yearOfCompletion 
            });
        } else {
            // For teachers or other types, only include required fields
            user = await User.create({ 
                username, 
                email, 
                password: hashedPassword, 
                userType, 
                dob,
                yearOfExperience,
                jobProfile,
                placeOfWork,
            });
        }

        await user.save();
        const payload = {
            user: {
                id: user._id
            }
        };
        const id = user.id
        jwt.sign(payload, 'yoursecrettoken', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ message: 'User registered successfully', token,id });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// router.post('/signup', async (req, res) => {
//     try {
//         const { username, email, password, userType,dob } = req.body;

//         // Check if user already exists
//         let user = await User.findOne({ email });
//         if (user) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create new user
//         user = await User.create({ username, email, password: hashedPassword, userType,dob });
//         await user.save();
//         const payload = {
//             user: {
//                 id: user._id
//             }
//         };

//         jwt.sign(payload, 'yoursecrettoken', { expiresIn: '1h' }, (err, token) => {
//             if (err) throw err;
//             res.status(201).json({ message: 'User registered successfully', token });
//         });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

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
        const id = user.id
        jwt.sign(payload, 'secret_key', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({username, token, userType,id });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



module.exports = router;
