const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  author: { type: String },
  tags: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Blog', BlogSchema);
