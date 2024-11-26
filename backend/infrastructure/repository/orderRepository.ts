// <==================== file to create the repository for the order page ===================>

// importing the required modules
import { Order } from "../../core/entities/order/order";
import { IOrderRepository } from "../../core/repository/IOrderRepository";
import { order as OrderModel } from "../database/schema/orderSchema";
import { Product } from "../../core/entities/product/product";
import { product as ProductModel } from "../database/schema/productSchema";
import { User } from "../../core/entities/user/user";
import { user as UserModel } from "../database/schema/userSchema";
import { Cart } from "../../core/entities/cart/cart";
import { cart as CartModel } from "../database/schema/cartSchema";
import { Address } from "../../core/entities/address/address";
import { address as AddressModel } from "../database/schema/addressSchema";

// creating the repository
export class OrderRepository implements IOrderRepository {
  // for creating new Order
  async createOrder(order: Order): Promise<Order> {
    try {
      const resetTimeToMidnight = (date: Date): Date => {
        date.setHours(0, 0, 0, 0);
        return date;
      };

      const orderData = {
        userId: order.userId,
        cartId: order.cartId,
        products: order.products.map((product) => ({
          productId: product.productId.toString(),
          bookName: product.bookName || "",
          images: product.images,
          amount: product.amount,
          quantity: product.quantity,
        })),
        totalAmount: order.totalAmount,
        address: order.addressId,
        status: order.status,
        paymentMethod: order.paymentMethod,
        createdAt: resetTimeToMidnight(new Date(order.createdAt)),
        updatedAt: resetTimeToMidnight(new Date(order.updatedAt)),
      };

      const saveOrder = await OrderModel.create(orderData);

      const formattedProducts = saveOrder.products.map((product) => ({
        productId: product.productId.toString(),
        bookName: product.bookName || "",
        images: product.images,
        amount: product.amount,
        quantity: product.quantity,
      }));

      return new Order(
        saveOrder._id.toString(),
        saveOrder.userId.toString(),
        saveOrder.cartId.toString(),
        formattedProducts,
        saveOrder.totalAmount,
        saveOrder.addressId.toString(),
        saveOrder.status,
        saveOrder.paymentMethod,
        resetTimeToMidnight(new Date(saveOrder.createdAt)),
        resetTimeToMidnight(new Date(order.updatedAt))
      );
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // for getting the order history
  async getUserOrder(userId: string): Promise<Order[] | null> {
    try {
      const orders = await OrderModel.find({ userId: userId });
      if (orders.length <= 0) {
        return null;
      }

      const userOrder = await Promise.all(
        orders.map(async (order) => {
          const populatedProduct = await Promise.all(
            order.products.map(async (item) => {
              const product = await ProductModel.findById(
                item.productId
              ).lean();
              return product
                ? {
                    ...item,
                    productId: product._id.toString(),
                    images: product.images,
                    bookName: product.bookName,

                    amount: product.amount,
                  }
                : null;
            })
          );

          const filteredProducts = populatedProduct.filter((p) => p !== null);

          return new Order(
            order._id.toString(),
            order.userId.toString(),
            order.cartId.toString(),
            filteredProducts as Array<{
              productId: string;
              bookName: string;
              images: string[];
              quantity: number;
              amount: number;
            }>,

            order.totalAmount,
            order.addressId.toString(),
            order.status,
            order.paymentMethod,
            order.createdAt,
            order.updatedAt
          );
        })
      );

      return userOrder;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // for canceling the order
  async cancelOrder(orderId: string): Promise<Order | null> {
    try {
      const order = await OrderModel.findById({ _id: orderId });

      const resetTimeToMidnight = (date: Date): Date => {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        return newDate;
      };

      if (order?.status == "pending") {
        order.status = "canceled";

        await order.save();

        const formattedProducts = order.products.map((product) => ({
          productId: product.productId.toString(),
          bookName: product.bookName || "",
          images: product.images,
          amount: product.amount,
          quantity: product.quantity,
        }));

        return new Order(
          order._id.toString(),
          order.userId.toString(),
          order.cartId.toString(),
          formattedProducts,
          order.totalAmount,
          order.addressId.toString(),
          order.status,
          order.paymentMethod,
          order.createdAt,
          resetTimeToMidnight(new Date())
        );
      } else return null;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
