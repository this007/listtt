const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../User');
const Problem = require('../Problem');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if the username or email already exists in the database
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.send('<script>alert("Username or email already exists"); window.location.href = ".././register.html";</script>');
    }

    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = new User({
      username,
      password: hashedPassword,
      email,
      problemList: [], // Initialize the problemList as an empty array
    });
    await user.save();

    console.log({ message: 'User registered successfully' });
    res.redirect('/list');
  } catch (error) {
    console.error(error);
    res.send('<script>alert("Server error"); window.location.href = ".././register.html";</script>');
  }
});

// Add a problem to the user's problemList
router.post('/add-problem', async (req, res) => {
  try {
    const { username, problemNumber, problem, problemLink } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.send('<script>alert("User not found"); window.location.href = ".././login.html";</script>');
    }

    // Add the problem to the problemList
    user.problemList.push({ number: problemNumber, problem, problemLink });
    await user.save();

    console.log({ message: 'Problem added successfully' });
    res.redirect('/list');
  } catch (error) {
    console.error(error);
    res.send('<script>alert("Server error"); window.location.href = ".././login.html";</script>');
  }
});

// Update or remove a problem from the user's problemList
router.post('/update-problem', async (req, res) => {
  try {
    const { username, problemNumber, problem, problemLink, action } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.send('<script>alert("User not found"); window.location.href = ".././login.html";</script>');
    }

    // Find the index of the problem in the problemList
    const problemIndex = user.problemList.findIndex((item) => item.number === problemNumber);
    if (problemIndex === -1) {
      return res.send('<script>alert("Problem not found in the list"); window.location.href = "/list";</script>');
    }

    // Perform the specified action (update or remove)
    if (action === 'update') {
      // Update the problem details
      user.problemList[problemIndex].problem = problem;
      user.problemList[problemIndex].problemLink = problemLink;
    } else if (action === 'remove') {
      // Remove the problem from the list
      user.problemList.splice(problemIndex, 1);
    }

    await user.save();

    console.log({ message: 'Problem updated successfully' });
    res.redirect('/list');
  } catch (error) {
    console.error(error);
    res.send('<script>alert("Server error"); window.location.href = "/list";</script>');
  }
});

// Login
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        // return res.status(404).json({ error: 'User not found' });
        // Send a pop-up message to the client
        return res.send('<script>alert("User not found"); window.location.href = ".././login.html";</script>');
      }
  
      // Compare the entered password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // return res.status(401).json({ error: 'Invalid password' });
        // Send a pop-up message to the client
        return res.send('<script>alert("Invalid password"); window.location.href = ".././login.html";</script>');
      }
  
      console.log({ message: 'Login successful' });
      res.redirect('/list');
    } catch (error) {
      console.error(error);
      // res.status(500).json({ error: 'Server error' });
      res.send(`<script>alert("Server error"); window.location.href = ".././login.html"; </script>`);
    }
  });

module.exports = router;


