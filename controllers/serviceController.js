const Service = require('../models/Service');

exports.getAll = async (req, res) => {
  try {
    const services = await Service.find().sort('-createdAt');
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, icon, image } = req.body;
    const service = new Service({ title, description, icon, image });
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Service.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Service.findByIdAndDelete(id);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};
