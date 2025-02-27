// <========================== file to create the schema for the order ==============>

// importing the required modules
import mongoose, { Schema, model } from "mongoose";

// creating the schema
const orderSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cart",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      bookName: {
        type: String,
      },
      quantity: {
        type: Number,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      images: [
        {
          type: String,
          required: true,
        },
      ],
    },
  ],

  totalAmount: {
    type: Number,
    required: true,
  },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "address",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "shipped", "out for delivery", "delivered", "canceled"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "Online Payment", "Wallet"],
    default: "COD",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  isCancel: {
    type: Boolean,
    default: false,
  },
});

export const order = model("order", orderSchema);
