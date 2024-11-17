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
    fullAddress: string,
    locality: string,
    pincode: number,
    state: string,
    city: string
  ): Promise<Address> {
    try {
      const user = await this.userRepository.findByUserId(userId);
      if (!userId) {
        throw new Error("user not found");
      }

      const address = new Address(
        Date.now().toString(),
        userId,
        fullAddress,
        locality,
        pincode,
        city,
        state
      );
      const savedAddress = await this.addressRepository.createAddress(
        address as Address
      );

      return savedAddress;
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
  async findAddress(userId: string): Promise<Address[] | null> {
    try {
      const user = await this.userRepository.findByUserId(userId);
      if (!user) {
        throw new Error("user not found");
      }
      const addresses = await this.addressRepository.findAddress(userId);
      return addresses;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
