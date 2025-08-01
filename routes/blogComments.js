const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Blog = require('../models/Blog');

// Add comment to blog
router.post('/:blogId/comments', async (req, res) => {
  try {
    const { user, content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content required' });
    const comment = await Comment.create({ blog: req.params.blogId, user, content });
    res.json({ message: 'Comment added', comment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});

// Get comments for a blog
router.get('/:blogId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId }).sort({ createdAt: -1 });
    res.json({ comments });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});

module.exports = router;
