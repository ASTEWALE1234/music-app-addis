import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

export const dbConnection = async () => {
  const MONGO_DB_URI = process.env.MONGO_DB_URI;

  try {
    console.log("Connecting to the database...");

    await mongoose.connect(MONGO_DB_URI);

    console.log("Connected to MongoDB");

    // Additional database initialization code can be added here

  } catch (err) {
    throw err;
  }

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
  });

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });
};

export default dbConnection;