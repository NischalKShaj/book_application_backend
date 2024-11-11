// <=========================== file to create the user schema for the application ===========>

// importing the required modules
import { Schema, model } from "mongoose";

// user schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

// exporting the schema
export const user = model("user", userSchema);
