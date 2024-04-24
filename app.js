const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
require('dotenv').config();

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors())
const MONGO = process.env.MONGO_URI
// Connect to MongoDB
mongoose.connect(MONGO, {
   
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/follows', require('./routes/follows'));
app.use('/api/user',require("./routes/profileRoutes"))

// Route for uploading profile photo
app.post('/api/upload-profile-photo', upload.single('profilePhoto'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    // Access uploaded file info using req.file
    console.log(req.file);
    // Process the uploaded file (e.g., save it to the database, resize, etc.)
    // Respond with a success message
    res.status(200).json({ message: 'File uploaded successfully' });
});

// Start server
const PORT = process.env.PORT || 5000;
try{
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}catch{
    console.log("error")
}

