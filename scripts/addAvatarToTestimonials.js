// Script to add or update avatar field in all testimonials
const mongoose = require('mongoose');
const Testimonial = require('../models/Testimonial');

const MONGO_URI = 'mongodb+srv://hardikranka789:yourworker123@cluster0.ps3puku.mongodb.net/digital_agency?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI);

async function addAvatars() {
  try {
    const testimonials = await Testimonial.find();
    // Use available avatars from public folder
    const avatars = [
      'user1.jpg',
      'user2.jpg',
      'user3.jpg'
    ];
    let idx = 0;
    for (let t of testimonials) {
      t.avatar = avatars[idx % avatars.length];
      await t.save();
      console.log(`Updated testimonial: ${t.name} with avatar: ${t.avatar}`);
      idx++;
    }
    console.log('All testimonials updated!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.disconnect();
  }
}

addAvatars();
