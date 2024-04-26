// server/models/Subject.js
const mongoose = require('mongoose');

// Define the schema for subjects
const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  // You can add more fields as needed
});

// Create a Subject model based on the schema
const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
