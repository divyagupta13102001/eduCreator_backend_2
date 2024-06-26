const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const cloudinary = require('cloudinary').v2
require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const Message = require('./models/message');
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
app.use('/api/follows', require('./routes/follow'));
app.use('/api/user',require("./routes/profileRoutes"));
app.use('/api/topics',require("./routes/topics"));
app.use('/api/user',require('./routes/subjects'));
app.use('/api/user',require('./routes/profilePhotoUpload'));
app.use('/api/messages', require("./routes/messages"))


const server = http.createServer(app);
const io = socketIo(server);


const userSockets = {}; // Mapping of user IDs to socket connections

// io.on('connection', (socket) => {
//   console.log('New client connected');

//   // When a user connects, associate their user ID with their socket connection
//   socket.on('set user', (userId) => {
//     userSockets[userId] = socket;
//   });

//   // When a message is received from a client
//   socket.on('send message', async (data) => {
//     try {
//       const { sender, receiver, content } = data;

//       // Save the message to the database
//       const message = new Message({ sender, receiver, content });
//       await message.save();

//       // Emit the message to the receiver's socket connection
//       const receiverSocket = userSockets[receiver];
//       if (receiverSocket) {
//         receiverSocket.emit('receive message', message);
//       }

//       console.log('Message saved and sent to receiver:', message);
//     } catch (error) {
//       console.error('Error saving and sending message:', error);
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//     // Remove the user's socket connection from the mapping
//     Object.keys(userSockets).forEach((userId) => {
//       if (userSockets[userId] === socket) {
//         delete userSockets[userId];
//       }
//     });
//   });
// });
io.on('connection', (socket) => {
    console.log('New client connected');
  
    socket.on('join chat', (userId, otherUserId) => {
      const room = generateRoomId(userId, otherUserId); // Generate a unique room ID based on user IDs
      socket.join(room);
      console.log(`User ${userId} joined chat with User ${otherUserId}`);
    });
  
    socket.on('send message', async (data) => {
        try {
            const { sender, receiver, message } = data;
            const room = generateRoomId(sender, receiver);
      
            // Save the message to the database
            const newMessage = new Message({ sender, receiver, message });
            await newMessage.save();
      
            // Emit the message to the room
            io.to(room).emit('receive message', { sender, message });
          } catch (error) {
            console.error('Error saving and sending message:', error);
          }
        });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
  
  function generateRoomId(userId1, userId2) {
    // Generate a unique room ID based on user IDs
    return `${userId1}-${userId2}`;
  }
// Start server
const PORT = process.env.PORT || 5000;
try{
    server.listen(PORT, () => {console.log(`Server running on port ${PORT}`)

});
}catch{
    console.log("error")
}

