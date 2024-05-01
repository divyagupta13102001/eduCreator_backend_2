// routes/comments.js
const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const mongoose = require('mongoose');
router.post('/:postId/comments/:userId', async (req, res) => {
    const postId = req.params.postId;
    const userId = req.params.userId;
  
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newComment = new Comment({
            content: req.body.content,
            author: userId,
            post: postId,
        });

        const savedComment = await newComment.save();
        post.comments.push(savedComment._id);
        await post.save();
  
        res.status(201).json({
            message: "Successfully added",
            post: post // Sending the updated post object as part of the response
        });
    } catch (error) {
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
});



router.get('/:postId/comments', async (req, res) => {
    const { postId } = req.params;
  
    try {
      // Find the post by postId
      const post = await Post.findById(postId).populate('comments');
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      // Extract relevant information for each comment
      const comments = await Promise.all(post.comments.map(async (commentId) => {
        const comment = await Comment.findById(commentId).populate('author', 'username');
        return {
          postId: comment.post,
          commentId: comment._id,
          username: comment.author.username,
          content: comment.content,
          createdAt: comment.createdAt
        };
      }));
  
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: `Server error: ${error.message}` });
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

router.delete('/:commentId', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Ensure that the comment object is a Mongoose document
        if (!(comment instanceof mongoose.Document)) {
            return res.status(500).json({ message: 'Invalid comment object' });
        }

        await comment.remove();

        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.error(err); // Log the error to the console
        res.status(500).send('Server Error');
    }
});

module.exports = router;
