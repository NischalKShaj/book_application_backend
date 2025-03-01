// <============================== file to handle the image uploading ======================>

// importing the required modules
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import multer from "multer";
dotenv.config();

// Setting up multer with memory storage
const upload = multer({ storage: multer.memoryStorage() });

export const uploadImage = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  upload.array("images", 2)(req, res, async (err: any) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "File uploading error", error: err.message });
    }

    const isAddProduct = req.method === "POST";

    if (
      isAddProduct &&
      (!req.files || !(req.files as Express.Multer.File[]).length)
    ) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    try {
      const uploadedImages: string[] = [];

      for (const file of req.files as Express.Multer.File[]) {
        const base64Image = `data:${
          file.mimetype
        };base64,${file.buffer.toString("base64")}`;
        uploadedImages.push(base64Image);
      }

      req.body.imageUrls = uploadedImages;
      next();
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};
