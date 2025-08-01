const mongoose = require('mongoose');

const projectConsultationSchema = new mongoose.Schema({
  projectType: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  budget: { type: String, required: true },
  timeline: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProjectConsultation', projectConsultationSchema); 