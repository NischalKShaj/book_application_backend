// <==================== file to create the repository for the order page ===================>

// importing the required modules
import { User } from "../../core/entities/user/user";
import { user as UserModel } from "../database/schema/userSchema";
import { Address } from "../../core/entities/address/address";
import { IAddressRepository } from "../../core/repository/IAddressRepository";
import { address as AddressModel } from "../database/schema/addressSchema";

// creating the repository
export class AddressRepository implements IAddressRepository {
  // for finding all the address for the user
  async findAddress(userId: string): Promise<Address[] | null> {
    try {
      const addresses = await AddressModel.find({ userId: userId });

      return addresses.map((address) => ({
        _id: address._id.toString(),
        userId: address.userId.toString(),
        addresseeName: address.addresseeName,
        addresseePhone: address.addresseePhone,
        fullAddress: address.fullAddress,
        locality: address.locality,
        pincode: address.pincode,
        city: address.city,
        state: address.state,
      }));
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // for creating new address
  async createAddress(address: Address): Promise<Address> {
    try {
      const addressData = {
        userId: address.userId,
        addresseeName: address.addresseeName,
        addresseePhone: address.addresseePhone,
        fullAddress: address.fullAddress,
        locality: address.locality,
        pincode: address.pincode,
        state: address.state,
        city: address.city,
      };

      const newAddress = await AddressModel.create(addressData);

      console.log("new Address", newAddress);

      return new Address(
        newAddress._id.toString(),
        newAddress.userId.toString(),
        newAddress.addresseeName,
        newAddress.addresseePhone,
        newAddress.fullAddress,
        newAddress.locality,
        newAddress.pincode,
        newAddress.city,
        newAddress.state
      );
    } catch (error) {
      console.error("error creating address", error);
      throw new Error(error as string);
    }
  }

  // for finding one address
  async findOneAddress(addressId: string): Promise<Address | null> {
    try {
      const address = await AddressModel.findById({ _id: addressId }).lean();

      if (!address) return null;

      return {
        ...address,
        _id: address._id.toString(),
        userId: address.userId.toString(),
      };
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // for editing the address
  async editAddress(
    // userId: string,
    address: any,
    addressId: string
  ): Promise<Address | null> {
    try {
      const updatedAddress = await AddressModel.findByIdAndUpdate(
        addressId,
        { $set: address },
        { new: true, lean: true }
      );

      if (!updatedAddress) {
        throw new Error("No address found");
      }

      return {
        ...updatedAddress,
        _id: updatedAddress._id.toString(),
        userId: updatedAddress.userId.toString(),
      };
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // for removing the address for the user
  async removeAddress(addressId: string): Promise<Address | null> {
    try {
      const deletedAddress = await AddressModel.findByIdAndDelete(
        addressId
      ).lean();

      // Check if the address was found and deleted
      if (!deletedAddress) {
        throw new Error("No address found for this ID.");
      }

      // If deletedAddress is not null, return the transformed data
      return {
        _id: deletedAddress._id?.toString() || "",
        userId: deletedAddress.userId?.toString() || "",
        addresseeName: deletedAddress.addresseeName || "",
        addresseePhone: deletedAddress.addresseePhone || "",
        fullAddress: deletedAddress.fullAddress || "",
        locality: deletedAddress.locality || "",
        pincode: deletedAddress.pincode || 0,
        city: deletedAddress.city || "",
        state: deletedAddress.state || "",
      };
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
