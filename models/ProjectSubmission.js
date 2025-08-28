const mongoose = require('mongoose');

const projectSubmissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^[+]?[\s.-]?(\d[\s.-]?){7,}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  website: {
    type: String,
    trim: true
  },
  projectType: {
    type: String,
    required: [true, 'Please select a project type'],
    trim: true
  },
  budget: {
    type: String,
    required: [true, 'Please select a budget range'],
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'in_review', 'contacted', 'archived'],
    default: 'new'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.ProjectSubmission || 
       mongoose.model('ProjectSubmission', projectSubmissionSchema);
