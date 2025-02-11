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
          bookDescription: string;
          amount: number;
          images: string[];
        };
      }>({
        path: "productId",
        select: "bookName amount images bookDescription",
      });

      console.log("cart data for the user", cartData);

      return cartData.map((cart) => ({
        _id: cart._id.toString(),
        userId: cart.userId.toString(),
        productId: cart.productId._id.toString(),
        bookName: cart.productId.bookName,
        bookDescription: cart.productId.bookDescription,
        images: cart.productId.images,
        amount: cart.productId.amount,
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
      const cart = await CartModel.create(cartData);
      console.log("cart", cart);

      // adding new data
      const newCartData = await this.getSingleCartItem(
        cartData.userId,
        cartData.productId
      );

      console.log("newCart", newCartData);

      if (!newCartData) {
        console.error("error", newCartData);
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
        bookDescription: string;
        images: string[];
      };
    }>({
      path: "productId",
      select: "bookName amount images",
    });

    console.log("cart Item", cartItem);

    if (!cartItem) {
      return null;
    }

    return {
      _id: cartItem._id.toString(),
      userId: cartItem.userId.toString(),
      productId: cartItem.productId._id.toString(),
      bookName: cartItem.productId.bookName,
      bookDescription: cartItem.productId.bookDescription,
      images: cartItem.productId.images,
      amount: cartItem.productId.amount,
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
          bookDescription: string;
          images: string[];
        };
      }>({
        path: "productId",
        select: "bookName amount images",
      });

      console.log("item for stock validation", item);

      if (!item) {
        return null;
      }
      return {
        _id: item._id.toString(),
        userId: item.userId.toString(),
        productId: item.productId.toString(),
        bookName: item.productId.bookName,
        bookDescription: item.productId.bookDescription,
        images: item.productId.images,
        amount: item.productId.amount,
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

  // for removing the item from the cart
  async removeItem(cartId: string): Promise<string> {
    try {
      const cart = await CartModel.findByIdAndDelete(cartId);
      if (!cart) {
        throw new Error("cart not found");
      }
      return "item removed from the cart";
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // for clearing the Cart after order confirmation
  async clearCart(cartId: string[], userId: string): Promise<void> {
    try {
      await CartModel.deleteMany({ _id: { $in: cartId }, userId });
    } catch (error) {
      throw new Error("failed to clear cart");
    }
  }

  // for getting the single cart
  async getSingleCart(cartId: string): Promise<Cart | null> {
    try {
      return await CartModel.findById(cartId);
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
