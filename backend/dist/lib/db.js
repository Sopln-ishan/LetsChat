import mongoose from "mongoose";
const connectDB = async () => {
    try {
        const connectionString = process.env.MONGO_URI;
        if (connectionString) {
            await mongoose.connect(connectionString);
            console.log(`Mongo db has been connected`);
        }
        else {
            throw new Error("mongodb connection string undefined");
        }
    }
    catch (error) {
        console.error("Could not connect to DB");
        process.exit(1); // 1 means failed, 0 means succeeded
    }
};
export default connectDB;
//# sourceMappingURL=db.js.map