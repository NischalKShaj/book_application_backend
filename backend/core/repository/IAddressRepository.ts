// <=========== file to create interface for the address ====================>

// importing the required modules
import { Address } from "../entities/address/address";

// interface for the address
export interface IAddressRepository {
  findAddress(userId: string): Promise<Address[] | null>;
  createAddress(address: Address): Promise<Address>;
  findOneAddress(addressId: string): Promise<Address | null>;
  editAddress(address: any, addressId: string): Promise<Address | null>;
  removeAddress(addressId: string): Promise<Address | null>;
}
