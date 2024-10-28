// <============================ file to create the controller for the user =================>

// importing the required modules
import { Request, Response } from "express";
import { AuthService } from "../services/authServices";

// user controller
export class UserController {
  constructor(private authService: AuthService) {}
  // controller for signup
  async postSignup(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, phoneNumber } = req.body;
      const user = await this.authService.signup(
        username,
        email,
        password,
        phoneNumber
      );
      if (user) {
        res.status(201).json({
          _message: "user created successfully",
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
