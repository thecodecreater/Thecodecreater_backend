const Portfolio = require('../models/Portfolio');

exports.getAll = async (req, res) => {
  try {
    const items = await Portfolio.find().sort('-createdAt');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, image, link, tags } = req.body;
    const item = new Portfolio({ title, description, image, link, tags });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Portfolio.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Portfolio.findByIdAndDelete(id);
    res.json({ message: 'Portfolio deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};
