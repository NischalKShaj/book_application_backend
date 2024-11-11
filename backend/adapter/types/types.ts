// <======================== file to store the custom types =================>

// importing the required modules
import { Request } from "express";

// creating the type for the custom request for the image uploading
export interface CustomRequest extends Request {
  files?: Express.Multer.File[];
  imageUrls?: string[];
}
