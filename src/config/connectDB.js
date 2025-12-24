import mongoose from "mongoose";

export const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri)
        console.log('database connected successfully');
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}