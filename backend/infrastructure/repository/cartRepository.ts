// <===================== file to create the repository for the cart ==============>

// importing the required modules
import { Product } from "../../core/entities/product/product";
import { product as ProductModel } from "../database/schema/productSchema";
import { User } from "../../core/entities/user/user";
import { user as UserModel } from "../database/schema/userSchema";
import { Cart } from "../../core/entities/cart/cart";
import { ICartRepository } from "../../core/repository/ICartRepository";
import { cart as CartModel } from "../database/schema/cartSchema";

// creating the repository
export class CartRepository implements ICartRepository {
  // for getting all the data from the user's cart
  async getCart(userId: string): Promise<Cart[] | null> {
    try {
      const user = await UserModel.findById({ _id: userId });
      if (!user) {
        throw new Error("user not found");
      }

      const cartData = await CartModel.find({ userId }).populate<{
        productId: {
          _id: string;
          bookName: string;
          amount: number;
          images: string[];
        };
      }>({
        path: "productId",
        select: "bookName amount images",
      });

      return cartData.map((cart) => ({
        _id: cart._id.toString(),
        userId: cart.userId.toString(),
        productId: cart.productId._id.toString(),
        productName: cart.productId.bookName,
        images: cart.productId.images,
        amount: cart.productId.amount * cart.quantity,
        quantity: cart.quantity,
      }));
    } catch (error) {
      console.error("error", error);
      throw new Error(error as string);
    }
  }

  // for adding a new item to the cart
  async addItem(cartData: {
    userId: string;
    productId: string;
    quantity: number;
  }): Promise<Cart> {
    try {
      await CartModel.create(cartData);

      // adding new data
      const newCartData = await this.getSingleCartItem(
        cartData.userId,
        cartData.productId
      );

      if (!newCartData) {
        throw new Error("failed to retrieve the updated data");
      }

      return newCartData;
    } catch (error) {
      console.error("error", error);
      throw new Error(error as string);
    }
  }

  // for getting the single cart item
  async getSingleCartItem(
    userId: string,
    productId: string
  ): Promise<Cart | null> {
    const cartItem = await CartModel.findOne({ userId, productId }).populate<{
      productId: {
        _id: string;
        bookName: string;
        amount: number;
        images: string[];
      };
    }>({
      path: "productId",
      select: "bookName amount images",
    });

    if (!cartItem) {
      return null;
    }

    return {
      _id: cartItem._id.toString(),
      userId: cartItem.userId.toString(),
      productId: cartItem.productId._id.toString(),
      productName: cartItem.productId.bookName,
      images: cartItem.productId.images,
      amount: cartItem.productId.amount * cartItem.quantity,
      quantity: cartItem.quantity,
    };
  }

  // stock validating for the cart
  async getItem(productId: string): Promise<Cart | null> {
    try {
      const item = await CartModel.findOne({ productId: productId }).populate<{
        productId: {
          _id: string;
          bookName: string;
          amount: number;
          images: string[];
        };
      }>({
        path: "productId",
        select: "bookName amount images",
      });
      if (!item) {
        throw new Error();
      }
      return {
        _id: item._id.toString(),
        userId: item.userId.toString(),
        productId: item.productId.toString(),
        productName: item.productId.bookName,
        images: item.productId.images,
        amount: item.productId.amount * item.quantity,
        quantity: item.quantity,
      };
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // for updating the quantity
  async updateItem(cartData: Cart): Promise<Cart | null> {
    try {
      return await CartModel.findByIdAndUpdate(
        { _id: cartData._id },
        { $set: { quantity: cartData.quantity } },
        { new: true }
      );
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
