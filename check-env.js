require('dotenv').config();
console.log('Environment variables:', {
  NODE_ENV: process.env.NODE_ENV || 'Not set',
  MONGO_URI: process.env.MONGO_URI ? 'Set' : 'Not set',
  JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
  PORT: process.env.PORT || 5000
});
