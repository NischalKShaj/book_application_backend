// <===================== creating the functionality for the admin ==================>

// importing the required modules
import { Admin } from "../entities/admin/admin";

// creating the interface for the functionality for the admin
export interface IAdminRepository {
  findByEmail(email: string, password: string): Promise<Admin | null>;
}
