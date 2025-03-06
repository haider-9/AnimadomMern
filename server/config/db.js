import mongoose from "mongoose";
export const dbconn = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`db connected: ${db.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }

}