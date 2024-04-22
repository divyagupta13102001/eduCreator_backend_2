// routes/comments.js
const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');

// Add Comment
router.post('/', async (req, res) => {
    try {
        const { content, author, post } = req.body;

        const comment = new Comment({ content, author, post });
        await comment.save();

        res.status(201).json({ message: 'Comment added successfully', comment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Comments by Post ID
router.get('/post/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId }).populate('author', 'username');
        res.json(comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update Comment
router.put('/:commentId', async (req, res) => {
    try {
        const { content } = req.body;

        let comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        comment.content = content;
        await comment.save();

        res.json({ message: 'Comment updated successfully', comment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete Comment
router.delete('/:commentId', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        await comment.remove();

        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
