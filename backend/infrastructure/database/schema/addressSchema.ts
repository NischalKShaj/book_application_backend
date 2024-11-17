// <======================= file to create the address schema ===============>

// importing the required modules
import mongoose, { Schema, model } from "mongoose";

// creating the schema
const addressSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  fullAddress: {
    type: String,
    required: true,
  },
  locality: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});

export const address = model("address", addressSchema);
