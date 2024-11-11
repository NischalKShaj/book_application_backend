// <============================ file to create the repository for the user db ===================>

// importing the required modules
import { User } from "../../core/entities/user/user";
import { IUserRepository } from "../../core/repository/IUserRepository";
import { user as UserModel } from "../database/schema/userSchema";

// creating the user repo
export class UserRepository implements IUserRepository {
  // creating the new user
  async create(user: User): Promise<User> {
    try {
      const createdUser = await UserModel.create({
        username: user.username,
        email: user.email,
        password: user.password,
        phoneNumber: user.phoneNumber,
      });
      return new User(
        createdUser._id.toString(),
        createdUser.username,
        createdUser.email,
        createdUser.password,
        createdUser.phoneNumber
      );
    } catch (error) {
      console.error("error", error);
      throw new Error("error while creating the user");
    }
  }

  // for checking the existing user
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ email });
      return user
        ? new User(
            user._id.toString(),
            user.username,
            user.email,
            user.password,
            user.phoneNumber
          )
        : null;
    } catch (error) {
      console.error("error", error);
      throw new Error("error while finding the user");
    }
  }
}
