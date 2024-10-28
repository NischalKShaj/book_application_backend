// <============================= file to implement the user use case ====================>

// importing the required modules
import { IUserRepository } from "../repository/IUserRepository";
import { User } from "../entities/user/user";

// creating the user use case
export class UserUseCase {
  constructor(private userRepository: IUserRepository) {}
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
      const newUser = new User(
        Date.now().toString(),
        username,
        email,
        password,
        phoneNumber
      );
      return this.userRepository.create(newUser);
    } catch (error) {
      console.error("error", error);
      throw new Error("internal server error");
    }
  }
}
