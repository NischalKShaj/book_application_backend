// <============================== file for creating the interface for the user functionality ===============>

// importing the required modules
import { User } from "../entities/user/user";

// creating the interface for the IUserRepository
export interface IUserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByUserId(id: string): Promise<User | null>;
  updateUser(
    id: string,
    username: string,
    email: string,
    phoneNumber: string
  ): Promise<User | null>;
  findUsers(pageNumber: Number, limit: Number): Promise<User[] | null>;
}
