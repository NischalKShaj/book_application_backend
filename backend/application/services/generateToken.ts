// <====================== file to generate the token ==================>

// importing the required modules
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export class GenerateToken {
  // generating the token
  async generate(email: string): Promise<string> {
    return jwt.sign({ email: email }, process.env.SECRET as string, {
      expiresIn: "48h",
    });
  }
}
