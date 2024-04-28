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
      { name: 'Coding Languages', description: 'Programming languages used to write instructions for computers.' },
      { name: 'Game Development', description: 'The process of creating video games, including design, development, and testing.' },
      { name: 'Political Science', description: 'The study of politics, government systems, and political behavior.' },
      { name: 'Biology', description: 'The study of living organisms and their interactions with each other and their environments.' },
      { name: 'Chemistry', description: 'The study of matter, its properties, composition, and reactions.' },
      { name: 'Physics', description: 'The study of matter, energy, and the fundamental forces of nature.' },
      { name: 'Economics', description: 'The study of how individuals, businesses, and governments allocate resources to satisfy their needs and wants.' },
      { name: 'Art History', description: 'The study of visual art and its historical development and stylistic contexts.' },
      { name: 'Environmental Science', description: 'The study of the natural world and the impact of human activity on ecosystems.' },
      { name: 'Data Structures and Algorithms', description: 'Study of organizing and managing data effectively and algorithms for solving computational problems efficiently.' },
      { name: 'Web Development', description: 'The creation of websites and web applications using technologies like HTML, CSS, and JavaScript.' },
      { name: 'Mobile App Development', description: 'Development of applications for mobile devices, including iOS and Android platforms.' },
      { name: 'Machine Learning', description: 'A subset of artificial intelligence that focuses on developing algorithms that enable computers to learn from and make predictions based on data.' },
      { name: 'Blockchain Technology', description: 'A decentralized digital ledger technology used to record transactions across multiple computers.' },
      { name: 'Cybersecurity', description: 'The practice of protecting systems, networks, and data from digital attacks.' },
      { name: 'Game Design', description: 'The process of designing the content and rules of a game, including gameplay, mechanics, and storyline.' },
      { name: 'Digital Marketing', description: 'The use of digital channels such as social media, email, and search engines to promote products or services.' },
      { name: 'Graphic Design', description: 'The art of visual communication through the use of typography, photography, iconography, and illustration.' },
      { name: 'UI/UX Design', description: 'The design of user interfaces and user experiences for digital products, focusing on usability and visual aesthetics.' },
      { name: 'Photography', description: 'The art, science, and practice of capturing images using light, lenses, and cameras.' },
      { name: 'Animation', description: 'The process of creating moving images from static drawings, models, or computer-generated graphics.' },
      { name: 'Architecture', description: 'The art and science of designing and constructing buildings and other physical structures.' },
      { name: 'Interior Design', description: 'The design of interior spaces to enhance the function, safety, and aesthetics of a building.' },
      { name: 'Civil Engineering', description: 'The design, construction, and maintenance of infrastructure projects such as roads, bridges, and buildings.' },
      { name: 'Artificial Intelligence', description: 'The simulation of human intelligence processes by machines, especially computer systems.' },
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
