const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Post = require('../models/post');
const router = express.Router();
const User = require('../models/user');
const Subject = require('../models/Subject');
// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the directory where uploaded files will be stored temporarily
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for the uploaded file
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Initialize multer upload middleware
const upload = multer({storage: storage,
    fileField: 'photo'});

// Configure cloudinary
cloudinary.config({ 
    cloud_name: 'djmvvg9il', 
    api_key: '423272215234838', 
    api_secret: 'czAJFZ0rrcBGR5s4Nqguzje545A' 
  });


router.post('/upload/:userId/:subjectId', upload.single('photo'), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload file to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    const userId = req.params.userId;
    const subjectId = req.params.subjectId;

    // Find user by user ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find subject by subject ID
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Save photo metadata in database along with user and subject information
    const newPost = new Post({
      caption: req.body.caption,
      content: {
        public_id: result.public_id,
        url: result.secure_url
      },
      author: user._id,
      tag: subject.name
    });
    await newPost.save();

    // Respond with success message and photo metadata
    res.status(201).json({
      success: true,
      message: 'Photo uploaded successfully',
      photo: newPost
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});


router.get('/posts', async (req, res) => {
  try {
    // Fetch posts from the database
    const posts = await Post.find().populate('author', 'username').populate('tag', 'name').exec();

    // Map the posts to include author username and subject tag name
    const formattedPosts = posts.map(post => ({
      _id: post._id,
      caption: post.caption,
      content: post.content,
      author: post.author.username, // Retrieve username from populated author field
      tag: post.tag.name // Retrieve name from populated tag field
    }));

    res.status(200).json(formattedPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});




router.get('/posts/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find user by user ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find subjects selected by the user
    const selectedSubjects = user.selectedSubjects;

    // Fetch posts related to the selected subjects
    const posts = await Post.find({ tag: { $in: selectedSubjects } })
      .populate('author', 'username') 
      .populate('tag', 'name'); // Populate tag field with name of subject

    res.json(posts);0
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
