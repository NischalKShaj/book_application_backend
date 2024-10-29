// <============================ file to create the controller for the user =================>

// importing the required modules
import { Request, Response } from "express";
import { AuthService } from "../services/authServices";

// user controller
export class UserController {
  constructor(private authService: AuthService) {
    this.postSignup = this.postSignup.bind(this);
    this.postLogin = this.postLogin.bind(this);
  }
  // controller for signup
  async postSignup(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, phoneNumber } = req.body;
      console.log("username", username);
      if (!username || !email || !password || !phoneNumber) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      const user = await this.authService.signup(
        username,
        email,
        password,
        phoneNumber
      );
      if (user) {
        res.status(201).json({
          message: "user created successfully",
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phoneNumber,
          },
        });
      }
    } catch (error: any) {
      console.error("error", error);
      res.status(400).json({ error: error.message });
    }
  }

  // controller for login
  async postLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await this.authService.login(email, password);
      if (user) {
        res.status(202).json({
          message: "user logged in successfully",
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phoneNumber,
          },
        });
      }
    } catch (error: any) {
      console.error("error", error);
      res.status(400).json({ error: error.message });
    }
  }
}
