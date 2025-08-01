const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  link: { type: String },
  tags: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', PortfolioSchema);
