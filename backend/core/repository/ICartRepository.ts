// <================ file to create the interface for the cart functionality ==============>

// importing the data
import { Cart } from "../entities/cart/cart";

// creating the interface
export interface ICartRepository {
  getCart(userId: string): Promise<Cart[] | null>;
  addItem(cartData: {
    userId: string;
    productId: string;
    quantity: number;
  }): Promise<Cart>;
}
