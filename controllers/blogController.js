const Blog = require('../models/Blog');

exports.getAll = async (req, res) => {
  try {
    const blogs = await Blog.find().sort('-createdAt');
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, content, image, author, tags } = req.body;
    const blog = new Blog({ title, content, image, author, tags });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Blog.findByIdAndDelete(id);
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};
