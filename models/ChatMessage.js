const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  from: { type: String, required: true }, // user email or 'admin'
  to: { type: String, required: true },   // 'admin' or user email
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
