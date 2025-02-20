import mongoose from 'mongoose';

const connectToDatabase = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('Please define the MONGODB_URI environment variable insile .env file');
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Connected to database');
    } catch (error) {
        console.error('Error connecting to database:', error);

        process.exit(1);
    }
}

export default connectToDatabase;