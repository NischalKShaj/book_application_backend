// <============================ file to create the repository for the user db ===================>

// importing the required modules
import { User } from "../../core/entities/user/user";
import { IUserRepository } from "../../core/repository/IUserRepository";
import { user, user as UserModel } from "../database/schema/userSchema";

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

  // for find the user with id
  async findByUserId(id: string): Promise<User | null> {
    try {
      const user = await UserModel.findById({ _id: id });
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
      throw new Error(error as string);
    }
  }

  // for updating the user data
  async updateUser(
    id: string,
    username: string,
    email: string,
    phoneNumber: string
  ): Promise<User | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        id,
        { $set: { username, email, phoneNumber } },
        { new: true }
      );
      if (!user) {
        throw new Error("user not updated");
      }
      console.log("user repo", user);
      return {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        password: user.password,
      };
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // for getting all the users
  async findUsers(): Promise<User[] | null> {
    try {
      const allUsers = await UserModel.find();
      if (allUsers.length === 0) {
        return null;
      }
      return allUsers.map((user) => {
        const userObject = user.toObject();
        return {
          ...userObject,
          _id: user._id.toString(),
        };
      });
    } catch (error) {
      console.error("error from repo", error);
      throw new Error(error as string);
    }
  }
}
