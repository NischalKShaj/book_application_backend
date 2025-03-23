// <==================== file to create the repository for the order page ===================>

// importing the required modules
import { Order } from "../../core/entities/order/order";
import { mostOrders as MaxOrderModel } from "../database/schema/maxOrderSchema";
import { MaxOrder } from "../../core/entities/maxOrder/maxOrder";
import { IOrderRepository } from "../../core/repository/IOrderRepository";
import { order as OrderModel } from "../database/schema/orderSchema";
import mongoose from "mongoose";
import { Product } from "../../core/entities/product/product";
import { product as ProductModel } from "../database/schema/productSchema";
import { User } from "../../core/entities/user/user";
import { user as UserModel } from "../database/schema/userSchema";
import { Cart } from "../../core/entities/cart/cart";
import { cart as CartModel } from "../database/schema/cartSchema";
import { Address } from "../../core/entities/address/address";
import { address as AddressModel } from "../database/schema/addressSchema";
import { OrdersPerWeek, TopOrderedProduct } from "../../adapter/types/types";

// creating the repository
export class OrderRepository implements IOrderRepository {
  // for creating new Order
  async createOrder(order: Order): Promise<Order> {
    try {
      // const resetTimeToMidnight = (date: Date): Date => {
      //   date.setHours(0, 0, 0, 0);
      //   return date;
      // };

      const resetTimeToMidnight = (date: Date): Date => {
        const utcDate = new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            0,
            0,
            0,
            0
          )
        );
        return utcDate;
      };

      const orderData = {
        userId: order.userId,
        cartId: order.cartId.map(
          (id: string) => new mongoose.Types.ObjectId(id)
        ),
        products: order.products.map((product) => ({
          productId: product.productId.toString(),
          bookName: product.bookName || "",
          images: product.images,
          amount: product.amount,
          quantity: product.quantity,
        })),
        totalAmount: order.totalAmount,
        addressId: order.addressId,
        status: order.status,
        paymentMethod: order.paymentMethod,
        createdAt: resetTimeToMidnight(new Date(order.createdAt)),
        updatedAt: resetTimeToMidnight(new Date(order.updatedAt)),
        isCancel: order.isCancel,
        trackingId: order.trackingId,
      };

      console.log("order data", orderData);

      const saveOrder = await OrderModel.create(orderData);

      const today = resetTimeToMidnight(new Date());

      const existingOrder = await MaxOrderModel.findOne({ date: today });

      if (existingOrder) {
        // If a record exists, increment the number_of_order by 1
        await MaxOrderModel.updateOne(
          { _id: existingOrder._id },
          { $inc: { number_of_order: 1 } }
        );
      } else {
        // If no record exists, create a new document for today
        await MaxOrderModel.create({ date: today, number_of_order: 1 });
      }

      console.log("saved ORder", saveOrder);

      const formattedProducts = saveOrder.products.map((product) => ({
        productId: product.productId.toString(),
        bookName: product.bookName || "",
        images: product.images,
        amount: product.amount,
        quantity: product.quantity,
      }));

      console.log("address id", saveOrder.addressId.toString());

      const trackingId = "No id found";

      return new Order(
        saveOrder._id.toString(),
        saveOrder.userId.toString(),
        saveOrder.cartId.map((id: any) => id.toString()),
        formattedProducts,
        saveOrder.totalAmount,
        saveOrder.addressId.toString(),
        saveOrder.status,
        saveOrder.paymentMethod,
        resetTimeToMidnight(new Date(saveOrder.createdAt)),
        resetTimeToMidnight(new Date(order.updatedAt)),
        saveOrder.isCancel,
        trackingId
      );
    } catch (error) {
      console.error("error from repository", error);
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
                    quantity: item.quantity,
                  }
                : null;
            })
          );

          const filteredProducts = populatedProduct.filter((p) => p !== null);

          return new Order(
            order._id.toString(),
            order.userId.toString(),
            order.cartId.map((id: any) => id.toString()),
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
            order.updatedAt,
            order.isCancel,
            order.trackingId ?? ""
          );
        })
      );

      return userOrder.reverse();
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // for canceling the order
  async cancelOrder(orderId: string): Promise<Order | null> {
    try {
      const order = await OrderModel.findById({ _id: orderId });

      const resetTimeToMidnight = (date: Date): Date => {
        const utcDate = new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            0,
            0,
            0,
            0
          )
        );
        return utcDate;
      };

      if (order?.status == "Order Received") {
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
          order.cartId.map((id: any) => id.toString()),
          formattedProducts,
          order.totalAmount,
          order.addressId.toString(),
          order.status,
          order.paymentMethod,
          order.createdAt,
          resetTimeToMidnight(new Date()),
          order.isCancel,
          order.trackingId ?? ""
        );
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // for enabling the cancel button for the order
  async enableCancelOrder(orderId: string): Promise<boolean> {
    try {
      const order = await OrderModel.findByIdAndUpdate(
        orderId,
        { $set: { isCancel: true } },
        { new: true }
      );
      if (!order) {
        return false;
      }
      return true;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // for getting all the orders in the admin side
  async getOrders(): Promise<Order[] | null> {
    try {
      const orders = await OrderModel.find().lean();
      if (orders.length === 0) {
        return null;
      }
      return orders
        .map((order) => ({
          ...order,
          _id: order._id.toString(), // Convert ObjectId to string
        }))
        .reverse() as unknown as Order[];
    } catch (error) {
      console.error("error", error);
      throw new Error(error as string);
    }
  }

  // for updating the order status
  async updateOrderStatus(
    id: string,
    trackingId: string,
    status: string
  ): Promise<Order | null> {
    try {
      const updatedOrder = await OrderModel.findByIdAndUpdate(
        id,
        { $set: { status: status, trackingId: trackingId } },
        { new: true }
      );
      if (!updatedOrder) {
        throw new Error("Order not updated");
      }

      // for setting up the time
      // const resetTimeToMidnight = (date: Date): Date => {
      //   const newDate = new Date(date);
      //   newDate.setHours(0, 0, 0, 0);
      //   return newDate;
      // };

      const resetTimeToMidnight = (date: Date): Date => {
        const utcDate = new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            0,
            0,
            0,
            0
          )
        );
        return utcDate;
      };

      // for formatting the product
      const formattedProducts = updatedOrder.products.map((product) => ({
        productId: product.productId.toString(),
        bookName: product.bookName || "",
        images: product.images,
        amount: product.amount,
        quantity: product.quantity,
      }));

      // for returning the product with updated status
      return new Order(
        updatedOrder._id.toString(),
        updatedOrder.userId.toString(),
        updatedOrder.cartId.map((id: any) => id.toString()),
        formattedProducts,
        updatedOrder.totalAmount,
        updatedOrder.addressId.toString(),
        updatedOrder.status,
        updatedOrder.paymentMethod,
        updatedOrder.createdAt,
        resetTimeToMidnight(new Date()),
        updatedOrder.isCancel,
        updatedOrder.trackingId ?? ""
      );
    } catch (error) {
      console.error("error from repo", error);
      throw new Error(error as string);
    }
  }

  // getting order for the passed status
  async showOrderStatus(status: string): Promise<Order[] | null> {
    try {
      const orders = await OrderModel.find({ status }).lean();
      console.log("orders", orders);
      if (!orders) {
        return null;
      }

      // returning the orders
      return orders
        .map((order) => ({
          ...order,
          _id: order._id.toString(),
        }))
        .reverse() as unknown as Order[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // for getting the top orders for the admin graph
  async getTopOrder(): Promise<TopOrderedProduct[] | null> {
    try {
      const topProducts = await OrderModel.aggregate([
        { $unwind: "$products" }, // Flatten the products array
        {
          $group: {
            _id: "$products.productId", // Group by productId
            totalQuantity: { $sum: "$products.quantity" }, // Sum the quantity ordered
            totalSales: { $sum: "$products.amount" }, // Sum the total amount
          },
        },
        { $sort: { totalQuantity: -1 } }, // Sort in descending order by quantity
        { $limit: 5 }, // Get the top 5 products
        {
          $lookup: {
            from: "books", // Name of the product collection
            localField: "_id",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" }, // Convert productDetails array into an object
        {
          $project: {
            _id: 0,
            productId: "$_id",
            bookName: "$productDetails.bookName",
            totalQuantity: 1,
            totalSales: 1,
          },
        },
      ]);

      if (!topProducts) {
        return null;
      }
      console.log("top products from repository", topProducts);

      return topProducts;
    } catch (error) {
      console.error("Error fetching top ordered products:", error);
      throw new Error(error as string);
    }
  }

  // for getting the order Repository router
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const order = await OrderModel.findById(orderId);
      if (!order) {
        return null;
      }

      // for setting up the time
      // const resetTimeToMidnight = (date: Date): Date => {
      //   const newDate = new Date(date);
      //   newDate.setHours(0, 0, 0, 0);
      //   return newDate;
      // };

      const resetTimeToMidnight = (date: Date): Date => {
        const utcDate = new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            0,
            0,
            0,
            0
          )
        );
        return utcDate;
      };

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
        order.cartId.map((id: any) => id.toString()),
        formattedProducts,
        order.totalAmount,
        order.addressId.toString(),
        order.status,
        order.paymentMethod,
        order.createdAt,
        resetTimeToMidnight(new Date()),
        order.isCancel,
        order.trackingId ?? ""
      );
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // for making sure that the max number of order reached or not
  async checkForMaxOrder(date: Date): Promise<string | null> {
    try {
      const resetTimeToMidnightUTC = (date: Date): Date => {
        return new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            0,
            0,
            0,
            0
          )
        );
      };

      const startOfDay = resetTimeToMidnightUTC(new Date(date));
      const endOfDay = new Date(startOfDay);
      endOfDay.setUTCDate(startOfDay.getUTCDate() + 1); // Move to next day to create an exclusive upper bound

      console.log("Start of day:", startOfDay);
      console.log("End of day:", endOfDay);

      // Query all orders within that date range
      const check = await MaxOrderModel.findOne({
        date: { $gte: startOfDay, $lt: endOfDay },
      });

      console.log("Check from repository:", check);

      if (check && check.number_of_order >= 20) {
        console.log("Inside condition");
        return null;
      }
      return "Limit not reached";
    } catch (error) {
      console.error("Error:", error);
      throw new Error(error as string);
    }
  }

  // for getting the orders per week
  async getOrderPerWeek(): Promise<OrdersPerWeek[] | null> {
    try {
      const today = new Date();
      const endDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59
      ); // end of the current day
      const startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 6,
        0,
        0,
        0
      ); // start of 6 days ago
      const result = await MaxOrderModel.find({
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      }).sort({ date: 1 });

      const formattedData = result.map((sale) => ({
        date: sale.date,
        totalSales: sale.number_of_order,
      }));

      if (!formattedData) {
        return null;
      }
      return formattedData;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
