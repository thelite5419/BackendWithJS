import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`DB successfully connected to: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error('DB connection error:>', error.message);
        process.exit(1);
    }
};

export default connectDB;
