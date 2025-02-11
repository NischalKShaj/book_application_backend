// <================ file to handle the carts use-case =================>

// importing the required data
import { Cart } from "../entities/cart/cart";
import { ICartRepository } from "../repository/ICartRepository";
import { IProductRepository } from "../repository/IProductRepository";
import { IUserRepository } from "../repository/IUserRepository";

// creating the use-case for the data
export class CartUseCase {
  constructor(
    private cartRepository: ICartRepository,
    private productRepository: IProductRepository,
    private userRepository: IUserRepository
  ) {}

  // getting all the items from the cart
  async getCart(userId: string): Promise<Cart[] | null> {
    try {
      const cart = await this.cartRepository.getCart(userId);
      return cart;
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }

  // for adding new item to the cart
  async addItem(cartData: {
    userId: string;
    productId: string;
    quantity: number;
  }): Promise<{ success: boolean; cartItem?: Cart | null; message?: string }> {
    try {
      // to check the product existence
      const product = await this.productRepository.getProduct(
        cartData.productId
      );
      if (!product) {
        console.log("clg here !product");
        return { success: false, message: "No product found" };
      }

      const user = await this.userRepository.findByUserId(cartData.userId);
      if (!user) {
        console.log("clg here !user");
        return { success: false, message: "No user found" };
      }

      const existingItem = await this.cartRepository.getItem(
        cartData.productId
      );
      const requestedQuantity = existingItem
        ? existingItem.quantity + cartData.quantity
        : cartData.quantity;

      if (requestedQuantity > product.stock) {
        console.log("stock validation error");
        return { success: false, message: "Invalid stock entered" };
      }
      let cartItem;
      if (existingItem) {
        console.log("inside here", existingItem);
        existingItem.quantity = requestedQuantity;
        cartItem = await this.cartRepository.updateItem(existingItem);
      } else {
        cartItem = await this.cartRepository.addItem(cartData);
        console.log("cart item after saving", cartItem);
      }
      return { success: true, cartItem };
    } catch (error: any) {
      console.error("error", error);
      return { success: false, message: error.message || "An error occurred" };
    }
  }

  // for removing the item from the cart
  async removeItem(
    cartId: string,
    userId: string
  ): Promise<{ success: Boolean; cart: string }> {
    try {
      const user = await this.userRepository.findByUserId(userId);
      if (!user) {
        throw new Error("user not found");
      }

      const cart = await this.cartRepository.removeItem(cartId);
      if (!cart) {
        return { success: false, cart: "item not removed" };
      }
      return { success: true, cart: cart };
    } catch (error) {
      console.error("error", error);
      throw new Error(error as string);
    }
  }

  // increasing and decreasing quantity of the product
  async changeQuantity(
    cartId: string,
    userId: string,
    quantity: number,
    productId: string
  ) {
    try {
      const user = await this.userRepository.findByUserId(userId);
      if (!user) {
        throw new Error("user not found");
      }

      const product = await this.productRepository.getProduct(productId);
      if (!product) {
        throw new Error("product not found");
      }
      const cart = await this.cartRepository.getSingleCart(cartId);
      if (!cart) {
        throw new Error("cart not found");
      }

      const updatedQty = cart.quantity + quantity;

      if (updatedQty > product.stock) {
        throw new Error("invalid quantity");
      }
      cart.quantity = updatedQty;
      const updatedCart = await this.cartRepository.updateItem(cart);
      return updatedCart;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
