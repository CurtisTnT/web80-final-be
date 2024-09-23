import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    const MONGO_CONNECT = `${process.env.MONGO_URI}/${process.env.MONGO_DB}`;
    mongoose.connect(MONGO_CONNECT);
    console.log("Connected to database!");
  } catch (error) {
    console.error("Failed to connect to database");
  }
};

export default connectDatabase;
