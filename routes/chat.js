const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const jwt = require('jsonwebtoken');

// Middleware to check JWT auth
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

// Get chat history between user and admin
router.get('/history', auth, async (req, res) => {
  try {
    const email = req.user.email;
    const messages = await ChatMessage.find({
      $or: [
        { from: email, to: 'admin' },
        { from: 'admin', to: email }
      ]
    }).sort({ timestamp: 1 });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});

module.exports = router;
