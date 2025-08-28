const express = require('express');
const { submitProject } = require('../controllers/startProjectController');

const router = express.Router();

// @route   POST /api/start-project
// @desc    Create a new project submission
// @access  Public
router.post('/', (req, res, next) => {
  console.log('=== New Project Submission ===');
  console.log('Request body:', req.body);
  
  // Add CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Process the request
  submitProject(req, res, next);
});

module.exports = router;
