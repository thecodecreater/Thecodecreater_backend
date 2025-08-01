const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
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

// List all testimonials
router.get('/', adminAuth, async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    res.json({ testimonials });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});

// Add testimonial
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, content, avatar, rating } = req.body;
    const testimonial = await Testimonial.create({ name, content, avatar, rating });
    res.json({ message: 'Testimonial created', testimonial });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});

// Edit testimonial
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, content, avatar, rating } = req.body;
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { name, content, avatar, rating },
      { new: true }
    );
    res.json({ message: 'Testimonial updated', testimonial });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});

// Delete testimonial
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testimonial deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});

module.exports = router;
