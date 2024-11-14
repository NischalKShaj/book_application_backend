// <================ file to handle the carts use-case =================>

// importing the required data
import { Cart } from "../entities/cart/cart";
import { ICartRepository } from "../repository/ICartRepository";

// creating the use-case for the data
export class CartUseCase {
  constructor(private cartRepository: ICartRepository) {}

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
      const newItem = await this.cartRepository.addItem(cartData);
      return newItem;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
