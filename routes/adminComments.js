const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const jwt = require('jsonwebtoken');

function adminAuth(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, unauthorized' });
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// List all comments
router.get('/', adminAuth, async (req, res) => {
  try {
    const comments = await Comment.find({}).populate('blog', 'title').sort({ createdAt: -1 });
    res.json({ comments });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});

// Delete comment
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});

module.exports = router;
