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
      const address = await this.addressRepository.findOneAddress(addressId);
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

  // for editing the address
  async editAddress(
    userId: string,
    addressId: string,
    addresseeName: string,
    addresseePhone: string,
    fullAddress: string,
    locality: string,
    pincode: string,
    state: string,
    city: string
  ): Promise<{ address: Address | null; success: boolean }> {
    try {
      const user = await this.userRepository.findByUserId(userId);
      if (!user) {
        return { success: false, address: null };
      }

      const address = await this.addressRepository.findOneAddress(addressId);
      if (!address) {
        return { success: false, address: null };
      }

      const existingAddress = {
        addresseeName,
        addresseePhone,
        fullAddress,
        locality,
        pincode,
        state,
        city,
      };

      const editAddress = await this.addressRepository.editAddress(
        existingAddress,
        addressId
      );
      if (!editAddress) {
        return { success: false, address: null };
      }
      return { success: true, address: editAddress };
    } catch (error) {
      return { success: false, address: null };
    }
  }

  // for removing the address
  async removeAddress(
    addressId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const removeAddress = await this.addressRepository.removeAddress(
        addressId
      );
      if (!removeAddress) {
        return { success: false, message: "failed to remove address" };
      }
      return { success: true, message: "address removed successfully" };
    } catch (error) {
      return { success: false, message: "failed to remove address" };
    }
  }
}
