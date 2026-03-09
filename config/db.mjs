import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Atlas connection string
// Replace <db_password> with your actual password
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Sonali:sonaliB88.@student.tpfzofp.mongodb.net/?appName=Student';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Atlas Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

export default connectDB;

