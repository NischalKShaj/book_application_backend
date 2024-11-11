// <==================== setting up the application configuration ==================>

// importing the required modules
import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "../../presentation/routes/userRoutes";
import adminRouter from "../../presentation/routes/adminRoutes";
import { corsOptions } from "../config/corsOption";
dotenv.config();

// setting the app
const app = express();

// enabling the cookie parse
app.use(cookieParser());

// setting the parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enabling the cors policy
app.use(cors(corsOptions));

// setting the routes
app.use("/admin", adminRouter);
app.use("/", userRouter);

// setting the 404 error
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "page not found" });
});

// setting the error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "internal server error" });
});

// exporting the app
export default app;
