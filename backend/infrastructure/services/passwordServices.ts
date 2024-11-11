// <================================ file to implement the password hashing and rehashing ====================>

// importing the required modules
import bcrypt from "bcryptjs";

// for password hashing and rehashing
export class PasswordService {
  private readonly salt = 10;

  // for hashing the password
  async hash(password: string): Promise<string> {
    return bcrypt.hashSync(password, this.salt);
  }

  // for rehashing and comparing the password
  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
