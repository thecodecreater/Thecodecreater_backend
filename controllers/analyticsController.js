const Service = require('../models/Service');
const Blog = require('../models/Blog');
const Testimonial = require('../models/Testimonial');
const Admin = require('../models/Admin');

exports.dashboardStats = async (req, res) => {
  try {
    const [services, blogs, testimonials, admins] = await Promise.all([
      Service.countDocuments(),
      Blog.countDocuments(),
      Testimonial.countDocuments(),
      Admin.countDocuments(),
    ]);
    res.json({
      services,
      blogs,
      testimonials,
      admins,
    });
  } catch (err) {
    res.status(500).json({ message: 'Analytics fetch failed', err });
  }
};
