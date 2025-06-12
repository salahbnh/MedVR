import mongoose from 'mongoose';

const connectMongoDB = async () => {
    try {
        //
            await mongoose.connect(process.env.MONGODB_URI);
            console.log("Connected to MongoDB");
            return true; 
        //}
        //return false;
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
        return false;
    }
}

export default connectMongoDB;