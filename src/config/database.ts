import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URL as string);
    console.log(`MongoDB Connected: ${conn.connection.host} ^_^`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDatabase;