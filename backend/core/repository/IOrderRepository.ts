// <===================== file to create interface for the order management ====================>

// importing the required modules
import { TopOrderedProduct } from "../../adapter/types/types";
import { Order } from "../entities/order/order";

// creating the interface for the order management
export interface IOrderRepository {
  createOrder(order: Order): Promise<Order>;
  getUserOrder(userId: string): Promise<Order[] | null>;
  cancelOrder(orderId: string): Promise<Order | null>;
  enableCancelOrder(orderId: string): Promise<boolean>;
  getOrders(): Promise<Order[] | null>;
  updateOrderStatus(
    id: string,
    trackingId: string,
    status: string
  ): Promise<Order | null>;
  showOrderStatus(status: string): Promise<Order[] | null>;
  getTopOrder(): Promise<TopOrderedProduct[] | null>;
  getOrderById(orderId: string): Promise<Order | null>;
}
