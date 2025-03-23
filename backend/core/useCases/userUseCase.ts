// <============================= file to implement the user use case ====================>

// importing the required modules
import { IUserRepository } from "../repository/IUserRepository";
import { User } from "../entities/user/user";
import { PasswordService } from "../../infrastructure/services/passwordServices";
import { IAddressRepository } from "../repository/IAddressRepository";
import { Address } from "../entities/address/address";

// creating the user use case
export class UserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: PasswordService,
    private addressRepository: IAddressRepository
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

  // for getting user with id
  async findUserAndAddress(
    id: string,
    addressId: string
  ): Promise<{ user: User; address: Address }> {
    try {
      const user = await this.userRepository.findByUserId(id);
      if (!user) {
        throw new Error("user not found");
      }
      const address = await this.addressRepository.findOneAddress(addressId);
      if (!address) {
        throw new Error("address not found");
      }
      return { user: user, address: address };
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // for updating the user with id
  async findById(
    id: string,
    username: string,
    email: string,
    phoneNumber: string
  ): Promise<User | null> {
    try {
      const user = await this.userRepository.findByUserId(id);
      if (!user) {
        throw new Error("user not found");
      }
      const updatedUserData = await this.userRepository.updateUser(
        id,
        username,
        email,
        phoneNumber
      );
      console.log("user use case", updatedUserData);
      return updatedUserData;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // for getting all the users
  async getAllUsers(
    pageNumber: number,
    limit: number
  ): Promise<{ success: boolean; data: User[] | null }> {
    try {
      const allUsers = await this.userRepository.findUsers(pageNumber, limit);
      if (!allUsers) {
        return { success: false, data: null };
      }
      return { success: true, data: allUsers.reverse() };
    } catch (error) {
      console.error("error from usecase", error);
      throw new Error(error as string);
    }
  }
}
