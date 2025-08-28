const express = require('express');
const { createNewProject } = require('../controllers/newProjectController');
const router = express.Router();

// Enable CORS for this route
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Handle preflight requests
router.options('*', (req, res) => {
  res.status(200).end();
});

// Create new project
router.post('/', createNewProject);

module.exports = router;
