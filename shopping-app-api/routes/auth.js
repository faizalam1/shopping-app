const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  console.log(req.body);

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role} });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role} });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
