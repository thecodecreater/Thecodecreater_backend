const express = require('express');
const router = express.Router();

const ContactMessage = require('../models/ContactMessage');
// Save or email contact messages (now: save to MongoDB and log)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ message: 'All fields required' });
    // Save to DB
    const saved = await ContactMessage.create({ name, email, message });
    console.log('Contact message (saved to DB):', saved);
    res.json({ message: 'Message received' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message', err });
  }
});

module.exports = router;
