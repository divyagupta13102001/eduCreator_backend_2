const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const User = require('../models/user');

const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});


const upload = multer({ storage: storage });

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'djmvvg9il',
    api_key: '423272215234838',
    api_secret: 'czAJFZ0rrcBGR5s4Nqguzje545A'
});

// Route for uploading profile photo
router.post('/upload-profile-photo/:userId', upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const userId = req.params.userId;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const result = await cloudinary.uploader.upload(req.file.path);

        user.profilePhoto = result.secure_url;
        await user.save();

        res.status(200).json({ message: 'Profile photo uploaded successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET profile photo API
router.get('/profile-photo/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ profilePhoto: user.profilePhoto });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});
// PATCH profile photo API
router.patch('/update-profile-photo/:userId', upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        user.profilePhoto = result.secure_url;
        await user.save();
        res.status(200).json({ message: 'Profile photo updated successfully', profilePhoto: user.profilePhoto });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});
router.post('/upload-Id/:userId', upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const userId = req.params.userId;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(user.userType==='student'){
            return res.status(404).json({ message: 'User not allowed' }); 
        }
        const result = await cloudinary.uploader.upload(req.file.path);

        user.identityCard = result.secure_url;
        await user.save();

        res.status(200).json({ message: 'id photo uploaded successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});
router.get('/idCard/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has uploaded an ID card
        if (!user.identityCard) {
            return res.status(404).json({ message: 'ID card not found for this user' });
        }

        res.status(200).json({ identityCard: user.identityCard });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
