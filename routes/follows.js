// routes/follows.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Follow a User
router.post('/:userId', async (req, res) => {
    try {
        const followerId = req.user.id;
        const followingId = req.params.userId;

        let user = await User.findById(followerId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.following.includes(followingId)) {
            return res.status(400).json({ message: 'Already following this user' });
        }

        user.following.push(followingId);
        await user.save();

        res.json({ message: 'User followed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Unfollow a User
router.delete('/:userId', async (req, res) => {
    try {
        const followerId = req.user.id;
        const followingId = req.params.userId;

        let user = await User.findById(followerId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.following.includes(followingId)) {
            return res.status(400).json({ message: 'Not following this user' });
        }

        user.following = user.following.filter(userId => userId !== followingId);
        await user.save();

        res.json({ message: 'User unfollowed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
