const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Post = require('../models/post');

const router = express.Router();

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

// Route to handle file upload
router.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload file to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Save photo metadata in database
    const newPost = new Post({
      caption: req.body.caption,
      content: {
        public_id: result.public_id,
        url: result.secure_url
      },
      tag:req.body.caption,
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

module.exports = router;






// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const Post = require('../models/post');
// const Subject = require('../models/Subject'); 
// const User = require("../models/user");
// const cloudinary = require("cloudinary");
// const router = express.Router();
// router.post('/uploadPost/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId; 
//     const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
//       folder: "posts",
//     });
//     const newPostData = {
//       caption: req.body.caption,
//       content: {
//         public_id: myCloud.public_id,
//         url: myCloud.secure_url,
//       },
//       author: req.user.userId,
//       tag:req.body.tag,
//     };

//     const post = await Post.create(newPostData);

//     const user = await User.findById(req.user.userId);

//     user.posts.unshift(post._id);

//     await user.save();
//     res.status(201).json({
//       success: true,
//       message: "Post created",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });
// module.exports = router;
// // // Create Post
// // router.post('/', async (req, res) => {
// //     try {
// //         const { content, author } = req.body;

// //         const post = new Post({ content, author });
// //         await post.save();

// //         res.status(201).json({ message: 'Post created successfully', post });
// //     } catch (err) {
// //         console.error(err.message);
// //         res.status(500).send('Server Error');
// //     }
// // });

// // // Get All Posts
// // router.get('/', async (req, res) => {
// //     try {
// //         const posts = await Post.find().populate('author', 'username');
// //         res.json(posts);
// //     } catch (err) {
// //         console.error(err.message);
// //         res.status(500).send('Server Error');
// //     }
// // });

// // // Get Post by ID
// // router.get('/:postId', async (req, res) => {
// //     try {
// //         const post = await Post.findById(req.params.postId).populate('author', 'username');
// //         if (!post) {
// //             return res.status(404).json({ message: 'Post not found' });
// //         }
// //         res.json(post);
// //     } catch (err) {
// //         console.error(err.message);
// //         res.status(500).send('Server Error');
// //     }
// // });

// // // Update Post
// // router.put('/:postId', async (req, res) => {
// //     try {
// //         const { content } = req.body;

// //         let post = await Post.findById(req.params.postId);
// //         if (!post) {
// //             return res.status(404).json({ message: 'Post not found' });
// //         }

// //         post.content = content;
// //         await post.save();

// //         res.json({ message: 'Post updated successfully', post });
// //     } catch (err) {
// //         console.error(err.message);
// //         res.status(500).send('Server Error');
// //     }
// // });

// // // Delete Post
// // router.delete('/:postId', async (req, res) => {
// //     try {
// //         const post = await Post.findById(req.params.postId);
// //         if (!post) {
// //             return res.status(404).json({ message: 'Post not found' });
// //         }

// //         await post.remove();

// //         res.json({ message: 'Post deleted successfully' });
// //     } catch (err) {
// //         console.error(err.message);
// //         res.status(500).send('Server Error');
// //     }
// // });

// // module.exports = router;
// // // const express = require("express");
// // // const {
// // //   createPost,
// // //   likeAndUnlikePost,
// // //   deletePost,
// // //   getPostOfFollowing,
// // //   updateCaption,
// // //   commentOnPost,
// // //   deleteComment,
// // // } = require("../controllers/post");
// // // const { isAuthenticated } = require("../middlewares/auth");

// // // const router = express.Router();

// // // router.route("/post/upload").post(createPost);

// // // router
// // //   .route("/post/:id")
// // //   .get(likeAndUnlikePost)
// // //   .put(updateCaption)
// // //   .delete(deletePost);

// // // router.route("/posts").get( getPostOfFollowing);

// // // router
// // //   .route("/post/comment/:id")
// // //   .put(commentOnPost)
// // //   .delete(deleteComment);

// // // module.exports = router;