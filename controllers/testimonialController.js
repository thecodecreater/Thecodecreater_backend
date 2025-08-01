const Testimonial = require('../models/Testimonial');

exports.getAll = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort('-createdAt');
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, content, avatar, rating } = req.body;
    const testimonial = new Testimonial({ name, content, avatar, rating });
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Testimonial.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Testimonial.findByIdAndDelete(id);
    res.json({ message: 'Testimonial deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};
