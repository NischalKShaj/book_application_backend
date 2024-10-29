// <============= file to create the user routes ====================>

// importing the required modules
import express, { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/repository/userRepository";
import { UserController } from "../../application/controller/userController";
import { UserUseCase } from "../../core/useCases/userUseCase";
import { AuthService } from "../../application/services/authServices";
import { PasswordService } from "../../infrastructure/services/passwordServices";

// creating the router instance
const router = express.Router();
const userRepository = new UserRepository();
const passwordService = new PasswordService();
const userUseCase = new UserUseCase(userRepository, passwordService);
const authService = new AuthService(userUseCase);
const userController = new UserController(authService);

// route for home page
router.get("/", async (req: Request, res: Response) => {
  res.send("home page");
});

// route for posting the login page
router.post("/login", userController.postLogin);

// route for posting the signup page
router.post("/signup", userController.postSignup);

// exporting the router
export default router;
