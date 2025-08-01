const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
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

// List all blogs
router.get('/', adminAuth, async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});

// Add blog
router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, content, image, author, tags } = req.body;
    const blog = await Blog.create({ title, content, image, author, tags });
    res.json({ message: 'Blog created', blog });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});

// Edit blog
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { title, content, image, author, tags } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, image, author, tags },
      { new: true }
    );
    res.json({ message: 'Blog updated', blog });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});

// Delete blog
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});

module.exports = router;
