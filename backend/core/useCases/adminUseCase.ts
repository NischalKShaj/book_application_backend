// <========================= creating the file for the admin use-case ==================>

// importing the required modules
import { Admin } from "../entities/admin/admin";
import { IAdminRepository } from "../repository/IAdminRepository";

// creating the class for the admin use case
export class AdminUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  // for finding admin
  async findByEmail(email: string, password: string): Promise<Admin> {
    try {
      const admin = await this.adminRepository.findByEmail(email, password);
      if (!admin) {
        throw new Error("invalid admin credentials");
      }
      return admin;
    } catch (error) {
      console.error("error", error);
      throw new Error("internal server error");
    }
  }
}
