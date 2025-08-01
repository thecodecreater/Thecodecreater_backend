const express = require('express');
const router = express.Router();
const Header = require('../models/Header');

// Get header data
router.get('/', async (req, res) => {
  try {
    const header = await Header.findOne();
    res.json(header);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch header data' });
  }
});

// Create or update header data
router.post('/', async (req, res) => {
  try {
    let header = await Header.findOne();
    if (header) {
      // Update existing
      Object.assign(header, req.body);
      await header.save();
      return res.json(header);
    } else {
      // Create new
      header = new Header(req.body);
      await header.save();
      return res.json(header);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to save header data' });
  }
});

module.exports = router;
