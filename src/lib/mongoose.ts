// في lib/mongoose.ts
import mongoose from "mongoose";

let isConnected = false;

export async function connectToDB() {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URL!, {
      dbName: "threads-clone",
    });
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
