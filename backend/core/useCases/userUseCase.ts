// <============================= file to implement the user use case ====================>

// importing the required modules
import { IUserRepository } from "../repository/IUserRepository";
import { User } from "../entities/user/user";
import { PasswordService } from "../../infrastructure/services/passwordServices";

// creating the user use case
export class UserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: PasswordService
  ) {}
  // use-case for user signup
  async execute(
    username: string,
    email: string,
    password: string,
    phoneNumber: string
  ): Promise<User> {
    try {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new Error("user already exists");
      }
      const hashedPassword = await this.passwordService.hash(password);
      const newUser = new User(
        Date.now().toString(),
        username,
        email,
        hashedPassword,
        phoneNumber
      );
      return this.userRepository.create(newUser);
    } catch (error) {
      console.error("error", error);
      throw new Error("internal server error");
    }
  }

  // use-case for login
  async findByEmail(email: string, password: string): Promise<User> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new Error("invalid user email");
      }
      const validPassword = await this.passwordService.compare(
        password,
        user.password
      );
      if (!validPassword) {
        throw new Error("invalid user password");
      }
      return user;
    } catch (error) {
      console.error("error", error);
      throw new Error("invalid user credentials");
    }
  }
}
