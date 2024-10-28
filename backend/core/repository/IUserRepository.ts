// <============================== file for creating the interface for the user functionality ===============>

// importing the required modules
import { User } from "../entities/user/user";

// creating the interface for the IUserRepository
export interface IUserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
