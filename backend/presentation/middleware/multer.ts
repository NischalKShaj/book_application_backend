// <============================== file to handle the image uploading ======================>

// importing the required modules
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import multer from "multer";
import { Storage } from "@google-cloud/storage";
dotenv.config();

// setting the storage
const storage = new Storage({
  keyFilename: process.env.KEYFILENAME,
  projectId: process.env.PROJECT_ID,
});

// setup the bucket
const bucketName = process.env.BUCKET_NAME as string;

// setting up the multer
const upload = multer({ storage: multer.memoryStorage() });

// configuring the multer
export const uploadImage = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  upload.array("images", 3)(req, res, async (err: any) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "file uploading error", error: err.message });
    }

    if (!req.files || !(req.files as Express.Multer.File[]).length) {
      return res.status(400).json({ message: "no files uploaded" });
    }

    try {
      const bucket = storage.bucket(bucketName!);
      const uploadedImage: string[] = [];

      for (const file of req.files as Express.Multer.File[]) {
        const blob = bucket.file(file.originalname);
        const blobStream = blob.createWriteStream({
          resumable: false,
          contentType: file.mimetype,
        });

        await new Promise((resolve, reject) => {
          blobStream.on("error", (err) => {
            console.error("error", err.message);
            reject(err);
          });

          blobStream.on("finish", () => {
            const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
            uploadedImage.push(publicUrl);
            resolve(publicUrl);
          });
          blobStream.end(file.buffer);
        });
      }
      req.body.imageUrls = uploadedImage;
      next();
    } catch (error) {
      console.error("error", error);
      res.status(500).json({ message: "internal server error" });
    }
  });
};
