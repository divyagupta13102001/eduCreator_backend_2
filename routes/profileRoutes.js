// profileRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/user');

const router = express.Router();

// Route to get user profile information
router.get('/getprofile', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

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

module.exports = router;
