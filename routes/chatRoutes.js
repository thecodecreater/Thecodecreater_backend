const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Log all requests
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Test route
router.get('/test', (req, res) => {
  console.log('Test endpoint hit!');
  res.json({
    success: true,
    message: 'Chat API is working!',
    timestamp: new Date().toISOString()
  });
});

// Start new chat
router.post('/start', 
  express.json(), // Parse JSON body
  (req, res, next) => {
    console.log('Request body:', req.body);
    next();
  },
  chatController.startChat
);

// Handle chat message
router.post('/message', 
  express.json(), // Parse JSON body
  chatController.handleMessage
);

// Save contact details
router.post('/save-contact', 
  express.json(), // Parse JSON body
  chatController.saveContact
);

// 404 handler for chat routes
router.use((req, res) => {
  console.error(`404: Route not found - ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Error in chat routes:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = router;
