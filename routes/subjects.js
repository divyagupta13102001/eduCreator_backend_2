// server/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Subject = require('../models/Subject');

// Route to fetch subjects
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to seed subjects (insert subjects into the database)
router.post('/seed', async (req, res) => {
  try {
      const subjectsData = [
      { name: 'Science', description: 'The study of the natural world and phenomena.' },
      { name: 'Technology', description: 'The application of scientific knowledge for practical purposes.' },
      { name: 'Art', description: 'Creative expression of human imagination and skill.' },
      { name: 'History', description: 'Study of past events, particularly in human affairs.' },
      { name: 'Philosophy', description: 'Critical thinking about fundamental questions regarding existence, knowledge, values, reason, mind, and language.' },
      { name: 'Mathematics', description: 'The study of numbers, quantity, structures, space, and change.' },
      { name: 'Literature', description: 'Written works, especially those considered of superior or lasting artistic merit.' },
      { name: 'Music', description: 'Art form and cultural activity whose medium is sound and silence.' },
      { name: 'Psychology', description: 'The scientific study of the mind and behavior.' },
      { name: 'Sociology', description: 'The study of society, patterns of social relationships, social interaction, and culture.' },

    ];

    const insertedSubjects = await Subject.insertMany(subjectsData);

    res.json({ message: 'Subjects seeded successfully', subjects: insertedSubjects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to update user's selected subjects
router.post('/:userId/subjects', async (req, res) => {
    const userId = req.params.userId; 
  const { selectedSubjects } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.selectedSubjects = selectedSubjects;
    await user.save();

    res.json({ message: 'Selected subjects updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});



// Route to fetch subjects selected by a specific user
router.get('/:userId/getsubjects', async (req, res) => {
  const userId = req.params.userId;

  try {

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const selectedSubjectNames = user.selectedSubjects;
    const subjects = await Subject.find({ name: { $in: selectedSubjectNames } });
    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.patch('/:userId/updatesubjects', async (req, res) => {
  const userId = req.params.userId;
  const { selectedSubjects } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.selectedSubjects = selectedSubjects;
    await user.save();
    res.json({ message: 'Selected subjects updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
