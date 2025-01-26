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
  async findOneAddress(
    userId: string,
    addressId: string
  ): Promise<Address | null> {
    try {
      const address = await AddressModel.findById({ _id: addressId })
        .populate({
          path: "user",
          select: "_id",
        })
        .lean();

      if (!address) return null;

      return userId === address.userId.toString()
        ? new Address(
            address._id.toString(),
            address.userId.toString(),
            address.addresseeName,
            address.addresseePhone,
            address.fullAddress,
            address.locality,
            address.pincode,
            address.city,
            address.state
          )
        : null;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
