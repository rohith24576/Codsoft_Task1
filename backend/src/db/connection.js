import mongoose from 'mongoose';

const connectDB = async () => {
    if (process.env.USE_MOCK_DB === 'true') {
        console.log("\n⚠️ RUNNING IN MOCK DATABASE MODE (Local development only)");
        return;
    }
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED. Try setting USE_MOCK_DB=true in .env to skip this. Error: ", error.message);
        process.exit(1);
    }
};

export default connectDB;
