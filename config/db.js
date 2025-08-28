const mongoose = require('mongoose');

// Enable debug mode for development
mongoose.set('debug', true);

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MongoDB connection string is not defined in environment variables');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 45000,
      dbName: 'digital_agency' // Updated to match the database in the connection string
    };
    
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log('📊 Database Name:', conn.connection.name);
    
    // Verify the connection
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📚 Collections in database:', collections.map(c => c.name));
    
    // Event listeners for connection status
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to DB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('ℹ️  Mongoose disconnected');
    });

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('👋 Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
    
    return conn;
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
