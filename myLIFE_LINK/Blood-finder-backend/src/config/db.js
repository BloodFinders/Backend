const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lifelink');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    console.error('CRITICAL: MongoDB connection failed. Please ensure MongoDB is installed and running locally, or check the MONGO_URI in your .env file.');
    process.exit(1);
  }
};

module.exports = connectDB;
