const express = require('express');
const multer = require('multer');
const path = require('path');
const Post = require('../models/post');
const Subject = require('../models/Subject'); // Import the Subject model

const router = express.Router();

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// POST endpoint to upload a post with any type of data
router.post('/uploadPost', upload.single('file'), async (req, res) => {
  try {
    // Handle the uploaded file
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Access form fields
    const { content, author, subjectId } = req.body;

    // Check if subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(400).json({ error: 'Subject not found' });
    }

    // Create a new post object
    const post = new Post({
      content,
      author,
      tag: subjectId, // Set the tag to the subject ID
      createdAt: new Date(),
      comments: [],
    });

    // Save the post to the database
    await post.save();

    // Return a response indicating success
    res.status(201).json({
      message: 'Post created successfully',
      file: req.file,
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});


// Create Post
router.post('/', async (req, res) => {
    try {
        const { content, author } = req.body;

        const post = new Post({ content, author });
        await post.save();

        res.status(201).json({ message: 'Post created successfully', post });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get All Posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username');
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Post by ID
router.get('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate('author', 'username');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update Post
router.put('/:postId', async (req, res) => {
    try {
        const { content } = req.body;

        let post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.content = content;
        await post.save();

        res.json({ message: 'Post updated successfully', post });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete Post
router.delete('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await post.remove();

        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
