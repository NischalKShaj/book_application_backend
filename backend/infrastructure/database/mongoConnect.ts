// <===================== file to establish the database connection ===========>

// importing the required modules
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// setting the mongodb url
const mongodb_url = process.env.MONGODB_URL;

// for max retires and the initial time delay]
const MAX_RETRIES = Infinity;
const INITIAL_TIME_DELAY = 2000;

// function for retrying if no string is present
const stringFailure = async () => {
  while (!process.env.MONGODB_URL) {
    console.error("⚠️  No MongoDB URL found. Retrying in 5 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    dotenv.config();
  }
};

// setting up the constraints for the automatic server restarting
const connectionRetry = async (
  retries = MAX_RETRIES,
  delay = INITIAL_TIME_DELAY
) => {
  await stringFailure();
  while (true) {
    try {
      await mongoose.connect(mongodb_url as string);
      console.log("🍃database connected");
      break; // to exit from the connection loop
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
      delay = Math.min(delay * 2, 60000);
    }
  }
};

// establishing the connection
export const connection = async () => {
  await connectionRetry();
};
