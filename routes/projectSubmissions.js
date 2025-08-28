const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  createProjectSubmission,
  getProjectSubmissions
} = require('../controllers/projectController');

// Public route for submitting project form
router.post('/', createProjectSubmission);

// Protected admin routes for viewing submissions
router.get('/', protect, admin, getProjectSubmissions);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

module.exports = router;
