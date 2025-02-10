// <========================= file to create the auth service for the app =================>

// importing the required modules
import { UserUseCase } from "../../core/useCases/userUseCase";
import { User } from "../../core/entities/user/user";
import { Admin } from "../../core/entities/admin/admin";

// creating the auth service
export class AuthService {
  constructor(private userUseCase: UserUseCase) {}

  // for signing up with user credentials
  async signup(
    username: string,
    email: string,
    password: string,
    phoneNumber: string
  ): Promise<User> {
    return this.userUseCase.execute(username, email, password, phoneNumber);
  }

  // for log in the user with credentials
  async login(email: string, password: string): Promise<User> {
    return this.userUseCase.findByEmail(email, password);
  }

  // for updating the user profile
  async updateProfile(
    id: string,
    username: string,
    email: string,
    phoneNumber: string
  ): Promise<{ success: Boolean; data: User | null }> {
    const user = await this.userUseCase.findById(
      id,
      username,
      email,
      phoneNumber
    );
    console.log("auth service", user);
    return { success: true, data: user };
  }
}
