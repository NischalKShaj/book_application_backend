// <===================== file to establish the database connection ===========>

// importing the required modules
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// setting the mongodb url
const mongodb_url = process.env.MONGODB_URL;

if (!mongodb_url) {
  console.error("db error no url provided");
}

// establishing the connection
export const connection = async () => {
  try {
    await mongoose.connect(mongodb_url as string);
    console.log("🍃database connected");
  } catch (error) {
    console.error("🍃 error while connecting to the database", error);
  }
};
