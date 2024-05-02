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



module.exports = router;