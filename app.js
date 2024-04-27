const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const cloudinary = require('cloudinary').v2
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
app.use('/api/user',require("./routes/profileRoutes"));
app.use('/api/topics',require("./routes/topics"));
app.use('/api/user',require('./routes/subjects'));



app.post('/api/upload-profile-photo', upload.single('profilePhoto'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    
    console.log(req.file);
    
    res.status(200).json({ message: 'File uploaded successfully' });
});

// Start server
const PORT = process.env.PORT || 5000;
try{
    app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)

});
}catch{
    console.log("error")
}

