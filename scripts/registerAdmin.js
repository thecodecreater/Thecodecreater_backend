const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('../models/Admin');

async function registerAdmin() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const email = 'belimvasim378@gmail.com';
  const password = 'Vasim123';

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 10);
  await Admin.create({ email, password: hashed });
  console.log('Admin registered:', email);
  process.exit(0);
}

registerAdmin();
