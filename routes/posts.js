
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
 
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
   
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Initialize multer upload middleware for multiple files
const upload = multer({ storage: storage });

// Configure cloudinary
cloudinary.config({ 
    cloud_name: 'djmvvg9il', 
    api_key: '423272215234838', 
    api_secret: 'czAJFZ0rrcBGR5s4Nqguzje545A' 
  });

// Route to handle file upload
router.post('/upload/:userId/:subjectId', upload.array('files'), async (req, res) => {
  try {
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

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

    const uploadedFiles = [];

    // Upload each file to cloudinary
    for (const file of req.files) {
      let result;
      if (file.mimetype.startsWith('image')) {
        // Upload image file to cloudinary
        result = await cloudinary.uploader.upload(file.path);
        uploadedFiles.push(result.secure_url);
      } else if (file.mimetype.startsWith('video')) {
        // Upload video file to cloudinary
        result = await cloudinary.uploader.upload(file.path, { resource_type: 'video' });
        uploadedFiles.push(result.secure_url);
      } else {
        return res.status(400).json({ error: 'Unsupported file format' });
      }
      
    }
    const newPost = new Post({
      caption: req.body.caption,
      content: 
        uploadedFiles.map(url => ({ url })),
      
      author: user._id,
      tag: subject.name,
      fileUrls:uploadedFiles
    });
    const savedPost = await newPost.save();

    user.fileUrls = uploadedFiles;
    await user.save();
    // Respond with success message and file metadata
    res.status(201).json({
      success: true,
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});


///get podt created by a teacher
router.get('/postsBy/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; 

    // Fetch posts from the database for the specified user ID
    const posts = await Post.find({ 'author': userId }).populate('author', 'username').populate('tag', 'name').exec();

    // Map the posts to include author username and subject tag name
    const formattedPosts = posts.map(post => ({
      _id: post._id,
      caption: post.caption,
      content: post.content,
      author: post.author.username, 
      tag: post.tag.name 
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
