import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Use Docker container URI or fallback to local connection
    const mongoURI = process.env.MONGODB_URI || 'mongodb://host.docker.internal:27017/task-manager';
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      retryWrites: true
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};
