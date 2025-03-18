// schema for creating otp for the user verification

// importing the required modules for the file
import { Schema, model } from "mongoose";

// defining the schema for the db
const otpSchema = new Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 120,
  },
});

// exporting the otp
export const otp = model("otp", otpSchema);
