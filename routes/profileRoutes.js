// profileRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const router = express.Router();

// Route to get user profile information
router.get('/getprofile/:userId', async (req, res) => {
    try {
        const userId = req.params.userId; 
        // Find user by ID
        const user = await User.findById(userId).select('-password'); // Exclude password from response

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Customize the response based on user type
        let userProfile = {
            username: user.username,
            email: user.email,
            userType: user.userType,
            profilePhoto: user.profilePhoto,
            dob: user.dob,
            password: user.password
        };

        if (user.userType === 'student') {
            userProfile.schoolName = user.schoolName;
            userProfile.degree = user.degree;
            userProfile.yearOfCompletion = user.yearOfCompletion;
            userProfile.following = user.following;
        } else if (user.userType === 'teacher') {
            userProfile.placeOfWork = user.placeOfWork;
            userProfile.jobProfile = user.jobProfile;
            userProfile.yearOfExperience = user.yearOfExperience;
            userProfile.identityCard = user.identityCard;
            userProfile.followers = user.followers;
        }

        res.status(200).json({ userProfile });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.patch('/profile/:userId', async (req, res) => {
    try {
        const userId = req.params.userId; 
        console.log('Received', req.body);// Extract user ID from URL parameter
        const  userType  = req.body.userType;
        const password = req.body.password;
        console.log('Received userType:', userType); // Debugging log

        // Construct update object based on the fields provided in the request
        const updateFields = {};
        if (req.body.username) updateFields.username = req.body.username;
        if (req.body.email) updateFields.email = req.body.email;
        if (password) updateFields.password = await bcrypt.hash(password, 10);
        if (req.body.dob) updateFields.dob = req.body.dob;
        if (req.body.bio) updateFields.bio = req.body.bio;
        if (req.body.placeOfWork) updateFields.placeOfWork = req.body.placeOfWork;
        if (req.body.jobProfile) updateFields.jobProfile = req.body.jobProfile;
        if (req.body.yearOfExperience) updateFields.yearOfExperience = req.body.yearOfExperience;
        if (req.body.schoolName) updateFields.schoolName = req.body.schoolName;
        if (req.body.degree) updateFields.degree = req.body.degree;
        if (req.body.yearOfCompletion) updateFields.yearOfCompletion = req.body.yearOfCompletion;

        // Find user by ID and update only the specified fields
        const user = await User.findByIdAndUpdate(userId, { $set: updateFields }, { new: true }).select('-password');

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
