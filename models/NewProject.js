const mongoose = require('mongoose');

const newProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  projectType: {
    type: String,
    required: [true, 'Please select project type'],
    trim: true
  },
  budget: {
    type: String,
    required: [true, 'Please select budget'],
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in_progress', 'completed'],
    default: 'new'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NewProject', newProjectSchema);
