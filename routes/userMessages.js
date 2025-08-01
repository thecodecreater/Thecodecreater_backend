const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
function auth(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Get all contact messages for logged in user (by email)
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const messages = await ContactMessage.find({ email: user.email }).sort({ createdAt: -1 });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});

module.exports = router;
