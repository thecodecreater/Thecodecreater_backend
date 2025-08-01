const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const jwt = require('jsonwebtoken');

// Middleware to check admin (for demo, allow all for now)
function adminAuth(req, res, next) {
  // TODO: Replace with real admin check
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, unauthorized' });
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Get all contact messages
router.get('/', adminAuth, async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});

module.exports = router;
