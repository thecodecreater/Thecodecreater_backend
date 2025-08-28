const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5002; // Using a different port

// Enable CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Minimal test server is working!' });
});

// Chat test route
app.post('/api/chat/start', (req, res) => {
  console.log('Chat start endpoint hit!');
  res.json({
    success: true,
    message: '👋 Welcome to Codecreater! How can I help you today?',
    options: [
      '🌐 Website Development',
      '📱 Mobile App Development',
      '📈 Digital Marketing',
      '🎨 Logo & Branding',
      '❓ Other Help'
    ]
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n--- Minimal test server running on http://localhost:${PORT} ---`);
  console.log('Test endpoints:');
  console.log(`- http://localhost:${PORT}/api/test`);
  console.log(`- http://localhost:${PORT}/api/chat/start (POST)`);
});
