// Script to add or update image field in all blogs
const mongoose = require('mongoose');
const Blog = require('../models/Blog');

// TODO: Replace with your actual database name if different
const MONGO_URI = 'mongodb+srv://hardikranka789:yourworker123@cluster0.ps3puku.mongodb.net/digital_agency?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function addImages() {
  try {
    const blogs = await Blog.find();
    // List of available images from public folder
    const images = [
      'business.jpg',
      "A stylish illustration for a blog titled 'How Promo Videos Can 10x Your Brand Visibility Online'. Show a video play button on a laptop or smartphone screen, with social media icons floating around (like heart, share.jpg",
      "A clean digital illustration for a blog post titled 'Top 5 SEO Strategies to Skyrocket Your Google Ranking in 2025'. The image should show a search bar, magnifying glass with 'SEO', upward arrows, analytics dashboar.jpg"
    ];
    let idx = 0;
    for (let blog of blogs) {
      blog.image = images[idx % images.length];
      await blog.save();
      console.log(`Updated blog: ${blog.title} with image: ${blog.image}`);
      idx++;
    }
    console.log('All blogs updated!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.disconnect();
  }
}

addImages();
