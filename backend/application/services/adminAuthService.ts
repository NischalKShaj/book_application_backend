// <========================= file to create the auth service for the app =================>

// importing the required modules

import { Admin } from "../../core/entities/admin/admin";
import { AdminUseCase } from "../../core/useCases/adminUseCase";

// creating the auth service
export class AdminAuthService {
  constructor(private adminUseCase: AdminUseCase) {}

  // for login the admin with credentials
  async adminLogin(email: string, password: string): Promise<Admin> {
    return this.adminUseCase.findByEmail(email, password);
  }
}
