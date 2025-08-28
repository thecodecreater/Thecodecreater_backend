const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
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
    // More flexible phone number validation
    validate: {
      validator: function(v) {
        // Allow empty or valid phone number
        if (!v) return true;
        // Simple validation for phone numbers - allows most common formats
        return /^[+]?[\s.-]?(\d[\s.-]?){7,}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  subject: {
    type: String,
    trim: true,
    default: 'General Inquiry',
    maxlength: [100, 'Subject cannot be more than 100 characters']
  },
  message: { 
    type: String, 
    required: [true, 'Please provide your message'],
    minlength: [10, 'Message must be at least 10 characters long']
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'resolved', 'spam'],
    default: 'new'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
contactMessageSchema.index({ email: 1, status: 1 });
contactMessageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
