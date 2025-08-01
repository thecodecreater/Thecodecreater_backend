const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  link: { type: String, required: true }
});

const HeaderSchema = new mongoose.Schema({
  logo: { type: String, required: false }, // image url or text
  heading: { type: String, required: false },
  paragraph: { type: String, required: false },
  buttonText: { type: String, required: false },
  buttonLink: { type: String, required: false },
  button2Text: { type: String, required: false },
  button2Link: { type: String, required: false },
  menuItems: [MenuItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Header', HeaderSchema);
