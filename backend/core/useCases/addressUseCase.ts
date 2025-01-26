// <================ file to handle the address use-case =================>

// importing the required data
import { Address } from "../entities/address/address";
import { IAddressRepository } from "../repository/IAddressRepository";
import { IUserRepository } from "../repository/IUserRepository";

// creating the use case
export class AddressUseCase {
  constructor(
    private addressRepository: IAddressRepository,
    private userRepository: IUserRepository
  ) {}

  // for creating new address
  async createAddress(
    userId: string,
    addresseeName: string,
    addresseePhone: string,
    fullAddress: string,
    locality: string,
    pincode: number,
    state: string,
    city: string
  ): Promise<{ savedAddress?: Address | null; success: boolean }> {
    try {
      const user = await this.userRepository.findByUserId(userId);
      if (!user) {
        throw new Error("user not found");
      }

      const address = new Address(
        Date.now().toString(),
        userId,
        addresseeName,
        addresseePhone,
        fullAddress,
        locality,
        pincode,
        city,
        state
      );
      const savedAddress = await this.addressRepository.createAddress(
        address as Address
      );

      console.log("saved address", savedAddress);

      if (!savedAddress) {
        return { success: false, savedAddress };
      }

      return { success: true, savedAddress };
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // for finding one address
  async findOneAddress(
    userId: string,
    addressId: string
  ): Promise<Address | null> {
    try {
      const user = await this.userRepository.findByUserId(userId);
      if (!user) {
        throw new Error("user not found");
      }
      const address = await this.addressRepository.findOneAddress(
        userId,
        addressId
      );
      if (!address) return null;
      return address;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // for finding all the address
  async findAddress(
    userId: string
  ): Promise<{ addresses: Address[] | null; success: boolean }> {
    try {
      const user = await this.userRepository.findByUserId(userId);
      if (!user) {
        throw new Error("user not found");
      }
      const addresses = await this.addressRepository.findAddress(userId);
      if (!addresses) {
        return { success: false, addresses: null };
      }
      return { addresses: addresses, success: true };
    } catch (error) {
      return { success: false, addresses: null };
    }
  }
}
