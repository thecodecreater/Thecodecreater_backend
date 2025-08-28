const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  createContactMessage,
  getContactMessages
} = require('../controllers/contactController');

// Public route for submitting contact form
router.post('/', createContactMessage);

// Protected admin routes for viewing messages
router.get('/', protect, admin, getContactMessages);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

module.exports = router;
