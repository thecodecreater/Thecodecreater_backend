import mongoose from 'mongoose';

const formSubmissionSchema = new mongoose.Schema({
  formId: {
    type: String,
    required: true,
    index: true
  },
  formData: {
    type: Object,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'completed', 'spam'],
    default: 'new'
  },
  metadata: {
    ip: String,
    userAgent: String,
    referrer: String
  }
}, {
  timestamps: true
});

export default mongoose.models.FormSubmission || 
       mongoose.model('FormSubmission', formSubmissionSchema);
