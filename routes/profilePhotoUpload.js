// profilePhotoUpload.js
const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/user');

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Route for uploading profile photo
router.post('/upload-profile-photo/:userId', upload.single('profilePhoto'), async (req, res) => {
    try {
        const userId = req.params.userId; 

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Store the file path in the user's profilePhoto field
        user.profilePhoto = req.file ? req.file.path : null;
        await user.save();

        res.status(200).json({ message: 'Profile photo uploaded successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
