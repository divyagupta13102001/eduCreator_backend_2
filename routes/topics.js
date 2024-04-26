const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');

// routes/topics.js


// Define an array of topics
const topics = ['Math', 'Science', 'History', 'Literature', 'Art', 'Music', 'Technology', 'Language'];

// GET route to retrieve available topics
router.get('/gettopics', (req, res) => {
    try {
        // Send the array of topics as the response
        res.json({ topics });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// PATCH route to update selected topics and subjects for a student
router.patch('/:id/topics-and-subjects', async (req, res) => {
    try {
        const studentId = req.params.id;
        const { selectedTopics } = req.body;

        // Validate that at least five options are selected
        // if (!selectedTopics || selectedTopics.length < 5 ) {
        //     return res.status(400).json({ message: 'Please select at least five topics and subjects' });
        // }

        // Update selected topics and subjects for the student
        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            { $set: { selectedTopics } },
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({ message: 'Selected topics and subjects updated successfully', student: updatedStudent });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



module.exports = router;
