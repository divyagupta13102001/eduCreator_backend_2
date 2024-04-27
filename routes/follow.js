// server/routes/follow.js

const express = require('express');
const router = express.Router();
const User = require('../models/user');

// POST /api/follow/:userId/follow/:otherId
router.post('/:userId/follow/:otherId', async (req, res) => {
  const followerId = req.params.userId;
  const userIdToFollow = req.params.otherId;

  try {
    // Check if the user exists
    const userToFollow = await User.findById(userIdToFollow);
    if (!userToFollow) {
      return res.status(404).json({ error: 'User to follow not found' });
    }

    // Check if the user is trying to follow themselves
    if (userIdToFollow === followerId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    // Check if the user is already following the target user
    if (userToFollow.followers.includes(followerId)) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    // Add the follower to the user's followers list
    userToFollow.followers.push(followerId);
    await userToFollow.save();

    // Add the user being followed to the follower's following list
    const follower = await User.findById(followerId);
    follower.following.push(userIdToFollow);
    await follower.save();

    res.json({ message: 'Successfully followed user' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.get('/followers/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Fetch each follower's username
      const followersWithUsernames = [];
      for (const followerId of user.followers) {
        const follower = await User.findById(followerId);
        if (follower) {
          followersWithUsernames.push({ id: follower.id, username: follower.username });
        }
      }
  
      res.json({ followers: followersWithUsernames });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  });
  
  router.get('/following/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Fetch each follower's username
      const followingWithUsernames = [];
      for (const followingId of user.following) {
        const following = await User.findById(followingId);
        if (following) {
          followingWithUsernames.push({ id: following.id, username: following.username });
        }
      }
  
      res.json({ following: followingWithUsernames });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  });
  
module.exports = router;
