const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

const app = express();

// Middleware - CORS setup
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parser middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

const NewProject = require('./models/NewProject');

// Project submission endpoint

app.post('/api/project-submit', async (req, res) => {
  try {
    const { name, email, projectType, budget, message, phone, website } = req.body;
    
    // Simple validation
    if (!name || !email || !projectType || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        required: ['name', 'email', 'projectType', 'budget']
      });
    }
    
    console.log('New project submission:', { name, email, projectType, budget });
    
    // Create and save project to MongoDB
    const newProject = new NewProject({
      name,
      email,
      phone: phone || '',
      website: website || '',
      projectType,
      budget,
      message: message || ''
    });
    
    const savedProject = await newProject.save();
    console.log('Project saved to database:', savedProject._id);
    
    res.status(201).json({
      success: true,
      message: 'Project submitted successfully!',
      data: savedProject
    });
    
  } catch (error) {
    console.error('Error submitting project:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// API routes
console.log('Registering API routes...');
try {
  // Import and use your existing routes
  app.use('/api/contact', require('./routes/contact'));
  app.use('/api/project-submissions', require('./routes/projectSubmissions'));
  app.use('/api/chat', require('./routes/chatRoutes'));
  
  console.log('All routes registered successfully');
} catch (error) {
  console.error('Error loading routes:', error);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Access the API at http://localhost:${PORT}`);
  console.log(`⚡ Health check: http://localhost:${PORT}/api/health`);
});