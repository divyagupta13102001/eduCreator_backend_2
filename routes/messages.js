const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Message= require("../models/message")


router.post('/:senderId/send/messages/:receiverId', async (req, res) => {
    const{text}=req.body
    const senderId= req.params.senderId;
    const receiverId = req.params.receiverId;
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId)
    if (!sender) {
      return res.status(404).json({ error: 'User not found' });
    }
    if(!receiver){
     return res.status(404).json({ error: 'User not found' });
    }
    try {
      const message = new Message({ 
        sender:senderId, 
        receiver:receiverId,
        content:text });
      await message.save();
      res.status(201).json(message);
    } catch (err) {
      res.status(500).json({ error: 'Failed to save message' });
    }
  });
// GET endpoint to retrieve messages between two users
router.get('/:userId/messages/:otherUserId', async (req, res) => {
    const userId = req.params.userId;
    const otherUserId = req.params.otherUserId;

    try {
        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: otherUserId },
                { sender: otherUserId, receiver: userId }
            ]
        }).sort({ timestamp: 'asc' });

        const sentMessages = messages.filter(message => String(message.sender) === userId);
        const receivedMessages = messages.filter(message => String(message.receiver) === userId);

        res.status(200).json({ sentMessages, receivedMessages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

router.get('/:userId/chatted-users', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find all messages where the user is either sender or receiver
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        });

        // Extract unique sender and receiver IDs
        const userIDs = Array.from(new Set(messages.flatMap(message => [message.sender, message.receiver])));

        // Remove the user's own ID from the list
        const otherUserIDs = userIDs.filter(id => id.toString() !== userId);

        // Fetch user details based on the IDs
        const chattedUsers = await User.find({ _id: { $in: otherUserIDs } });

        // Extract user names
        const chattedUserNames = chattedUsers.map(user => user.username); // Use 'username' field

        res.status(200).json(chattedUserNames);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch chatted users' });
    }
});


module.exports = router;