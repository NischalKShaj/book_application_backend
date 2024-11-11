// <====================== file to create the product schema for the application ===========>

// importing the required modules
import { Schema, model } from "mongoose";

// creating the schema
const bookSchema = new Schema({
  bookName: {
    type: String,
    required: true,
  },
  bookDescription: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
});

// exporting the schema
export const product = model("books", bookSchema);
