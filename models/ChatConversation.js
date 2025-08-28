const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'bot'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatConversationSchema = new mongoose.Schema({
  // Basic user info (filled at the end of conversation)
  userName: { type: String },
  userEmail: { type: String },
  userPhone: { type: String },
  
  // Chat details
  messages: [messageSchema],
  currentStep: { 
    type: String, 
    enum: ['service_selection', 'website_type', 'budget', 'timeline', 'contact_info', 'completed'],
    default: 'service_selection'
  },
  
  // User selections
  selectedService: { type: String },
  selectedWebsiteType: { type: String },
  selectedBudget: { type: String },
  selectedTimeline: { type: String },
  
  // Metadata
  ipAddress: { type: String },
  userAgent: { type: String },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  isCompleted: { type: Boolean, default: false },
  
  // For AI responses
  isAIAssisted: { type: Boolean, default: false },
  
  // For admin
  status: { 
    type: String, 
    enum: ['new', 'contacted', 'in_progress', 'completed', 'spam'],
    default: 'new'
  },
  notes: { type: String }
}, { timestamps: true });

// Add text index for searching
chatConversationSchema.index({
  userName: 'text',
  userEmail: 'text',
  userPhone: 'text',
  'messages.content': 'text',
  selectedService: 'text',
  selectedWebsiteType: 'text'
});

module.exports = mongoose.model('ChatConversation', chatConversationSchema);
