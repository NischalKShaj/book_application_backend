// <================== file to create schema for making max order per day ==============>

// importing the required modules
import { Schema, model } from "mongoose";

// creating the schema
const maxOrderSchema = new Schema({
  date: {
    type: Date,
    default: Date.now(),
  },
  number_of_order: {
    type: Number,
    default: 0,
  },
});

// exporting the schema
export const mostOrders = model("maxOrders", maxOrderSchema);
