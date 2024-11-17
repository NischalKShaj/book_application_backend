// <===================== file to create interface for the order management ====================>

// importing the required modules
import { Order } from "../entities/order/order";

// creating the interface for the order management
export interface IOrderRepository {
  createOrder(order: Order): Promise<Order>;
  getUserOrder(userId: string): Promise<Order[] | null>;
  //   cancelOrder(status: string, orderId: string): Promise<Order | null>;
}
