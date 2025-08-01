const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('../models/Admin');

async function checkAdmin() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  let admin = await Admin.findOne({ email: 'thecodeworker@gmail.com' });
  if (!admin) {
    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash('Thecode123', 12);
    admin = new Admin({ email: 'thecodeworker@gmail.com', password: hashed });
    await admin.save();
    console.log('Admin created:', admin);
  } else {
    console.log('Admin already exists:', admin);
  }
  // Print all admins
  const allAdmins = await Admin.find({});
  console.log('ALL ADMINS:', allAdmins.map(a => a.email));
  process.exit(0);
}

checkAdmin();
