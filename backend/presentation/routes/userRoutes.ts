// <============= file to create the user routes ====================>

// importing the required modules
import express, { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/repository/userRepository";
import { UserController } from "../../application/controller/userController";
import { UserUseCase } from "../../core/useCases/userUseCase";
import { AuthService } from "../../application/services/authServices";

// creating the router instance
const router = express.Router();
const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository);
const authService = new AuthService(userUseCase);
const userController = new UserController(authService);

// route for home page
router.get("/", async (req: Request, res: Response) => {
  res.send("home page");
});

// route for posting the signup page
router.post("/signup", userController.postSignup);

// exporting the router
export default router;
