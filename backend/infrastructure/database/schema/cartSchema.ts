// <================ file to create the schema for the cart ==============>

// importing the required modules
import mongoose, { Schema, model } from "mongoose";

// creating the schema
const cartSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "books",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

export const cart = model("cart", cartSchema);
