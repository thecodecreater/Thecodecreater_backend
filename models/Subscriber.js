import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  source: {
    type: String,
    enum: ['website', 'landing-page', 'manual', 'other'],
    default: 'website'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date
  },
  metadata: {
    ip: String,
    userAgent: String,
    referrer: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add index for faster queries
subscriberSchema.index({ email: 1 }, { unique: true });
subscriberSchema.index({ isActive: 1 });
subscriberSchema.index({ subscribedAt: -1 });

// Virtual for subscriber status
subscriberSchema.virtual('status').get(function() {
  return this.isActive ? 'active' : 'unsubscribed';
});

// Static method to check if email exists
subscriberSchema.statics.emailExists = async function(email) {
  const count = await this.countDocuments({ email });
  return count > 0;
};

// Method to unsubscribe
subscriberSchema.methods.unsubscribe = async function() {
  this.isActive = false;
  this.unsubscribedAt = new Date();
  return this.save();
};

export default mongoose.models.Subscriber || 
       mongoose.model('Subscriber', subscriberSchema);
