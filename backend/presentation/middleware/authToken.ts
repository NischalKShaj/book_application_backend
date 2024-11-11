// <================== file to authenticate the token for the user and the admin =================>

// importing the required modules
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
dotenv.config();

// creating the authentication middleware
export const authenticateUserJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token =
    req.cookies.access_token || req.headers["authorization"] || null;

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const actualToken = token.startsWith("Bearer ")
    ? token.slice(7, token.length)
    : token;

  const secret = process.env.SECRET;

  if (!secret) {
    throw new Error("No secret key was provided");
  }

  try {
    const decoded = jwt.verify(actualToken, secret);
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(401).json({ message: "Invalid Token" });
    return;
  }
};
