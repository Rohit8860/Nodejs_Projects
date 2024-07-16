import mongoose from "mongoose";

export const connectDB = async () => {
    if (mongoose.connection.readyState === 0) {
        try {
            await mongoose.connect('mongodb://localhost:27017/yourdbname');
            console.log('MongoDB connected...');
        } catch (err) {
            console.error(err.message);
            process.exit(1);
        }
    } else {
        console.log('Already connected to MongoDB');
    }
};