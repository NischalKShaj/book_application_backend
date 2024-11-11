// <=================================== creating the file for the admin repository ==================>

// importing the required modules
import { IAdminRepository } from "../../core/repository/IAdminRepository";
import { Admin } from "../../core/entities/admin/admin";
import dotenv from "dotenv";
dotenv.config();

// creating the admin repository
export class AdminRepository implements IAdminRepository {
  // creating the admin repository
  async findByEmail(email: string, password: string): Promise<Admin> {
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (adminEmail == email && adminPassword == password) {
        let admin = { email, password };
        return admin;
      } else {
        throw new Error("invalid admin credentials");
      }
    } catch (error) {
      console.error("error", error);
      throw new Error("invalid admin credentials");
    }
  }
}
