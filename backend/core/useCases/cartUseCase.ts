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
  }): Promise<Cart | null> {
    try {
      // to check the product existence
      const product = await this.productRepository.getProduct(
        cartData.productId
      );
      if (!product) {
        throw new Error("no product found");
      }

      const user = await this.userRepository.findByUserId(cartData.userId);
      if (!user) {
        throw new Error("no user found");
      }

      const existingItem = await this.cartRepository.getItem(
        cartData.productId
      );
      const requestedQuantity = existingItem
        ? existingItem.quantity + cartData.quantity
        : cartData.quantity;

      if (requestedQuantity > product.stock) {
        throw new Error("invalid stock entered");
      }

      if (existingItem) {
        existingItem.quantity = requestedQuantity;
        return await this.cartRepository.updateItem(existingItem);
      } else {
        return this.cartRepository.addItem(cartData);
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
