// <================ file to handle the order use-case =================>

// importing the required data
import { Order } from "../entities/order/order";
import { IOrderRepository } from "../repository/IOrderRepository";
import { IUserRepository } from "../repository/IUserRepository";
import { ICartRepository } from "../repository/ICartRepository";
import { IProductRepository } from "../repository/IProductRepository";
import { IAddressRepository } from "../repository/IAddressRepository";

// creating the useCase
export class OrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private userRepository: IUserRepository,
    private cartRepository: ICartRepository,
    private productRepository: IProductRepository,
    private addressRepository: IAddressRepository
  ) {}

  // for creating the order
  async createOrder(
    userId: string,
    totalAmount: number,
    paymentMethod: string,
    addressId: string,
    createdAt: Date
  ) {
    try {
      const user = await this.userRepository.findByUserId(userId);
      if (!user) {
        throw new Error("user not found");
      }

      const cart = await this.cartRepository.getCart(user._id);
      if (!cart) {
        throw new Error("cart empty");
      }
      const address = await this.addressRepository.findOneAddress(addressId);

      if (!address) {
        throw new Error("address not found");
      }

      const products = cart.map((item) => ({
        productId: item.productId,
        bookName: item.bookName,
        images: item.images,
        amount: item.amount,
        quantity: item.quantity,
      }));

      const order = new Order(
        Date.now().toString(),
        userId.toString(),
        cart.map((c) => c._id).toString(),
        products,
        totalAmount,
        addressId,
        "pending",
        paymentMethod,
        createdAt,
        createdAt,
        false
      );

      const savedOrder = await this.orderRepository.createOrder(order as Order);

      if (!savedOrder) {
        throw new Error("order was not saved");
      }

      // for updating the stock after ordering
      for (let product of products) {
        let existingProduct = await this.productRepository.getProduct(
          product.productId
        );
        if (!existingProduct) {
          console.error("error from product section");
          throw new Error("product not found");
        }
        const newStock = existingProduct.stock - product.quantity;
        if (newStock < 0) {
          throw new Error("insufficient stock for the product");
        }

        await this.productRepository.updateStock(product.productId, newStock);
      }

      // clearing the cart
      const cartIds = cart.map((c) => c._id);
      await this.cartRepository.clearCart(cartIds, userId);

      console.log("saved order", savedOrder);

      return savedOrder;
    } catch (error) {
      console.log("error from use case", error);
      throw new Error(error as string);
    }
  }

  // for getting the order
  async findOrder(userId: string): Promise<Order[] | null> {
    try {
      const user = await this.userRepository.findByUserId(userId);
      if (!user) {
        throw new Error("user not found");
      }

      const orders = await this.orderRepository.getUserOrder(userId);
      if (!orders) {
        throw new Error("no orders were found");
      }
      return orders;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // for cancelling the order
  async cancelOrder(userId: string, orderId: string): Promise<Order | null> {
    try {
      const user = await this.userRepository.findByUserId(userId);
      if (!user) {
        throw new Error("user not found");
      }
      const orders = await this.orderRepository.cancelOrder(orderId);
      if (!orders) {
        throw new Error("no order were found");
      }
      return orders;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // for getting the recent orders details
  async getRecentOrders(userId: string) {
    try {
      const user = await this.userRepository.findByUserId(userId);
      if (!user) {
        throw new Error("user not found");
      }
      const orders = await this.orderRepository.getUserOrder(userId);
      if (!orders) {
        return null;
      }

      const recentOrders = orders.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Get only the last 3 orders
      const latestOrders = recentOrders.slice(0, 3);
      const addressIds = latestOrders.map((order) => order.addressId);

      console.log("last orders", latestOrders);

      // fetching all the addresses
      const addresses = await Promise.all(
        addressIds.map(async (addressId) => {
          return this.addressRepository.findOneAddress(addressId);
        })
      );

      console.log("address", addresses);

      return { success: true, address: addresses, orders: latestOrders };
    } catch (error) {
      console.error("error from use case", error);
      throw new Error(error as string);
    }
  }

  // for enabling the flag for cancel req received
  async enableCancelOrder(userId: string, orderId: string) {
    try {
      const user = await this.userRepository.findByUserId(userId);
      if (!user) {
        throw new Error("user not found");
      }
      const orders = await this.orderRepository.getUserOrder(userId);
      if (!orders) {
        return null;
      }
      const enableCancel = await this.orderRepository.enableCancelOrder(
        orderId
      );
      if (!enableCancel) {
        return { success: false, message: "Couldn't update the status" };
      }
      return { success: true, message: "Updated successfully" };
    } catch (error) {
      console.error("error from use case", error);
      throw new Error(error as string);
    }
  }
}
