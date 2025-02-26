// <============================ file to create the controller for the user =================>

// importing the required modules
import { Request, Response } from "express";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();
import { AuthService } from "../services/authServices";
import { EmailSender } from "../services/emailService";
import { GenerateToken } from "../services/generateToken";
import { ProductUseCase } from "../../core/useCases/productUseCase";
import { CartUseCase } from "../../core/useCases/cartUseCase";
import { AddressUseCase } from "../../core/useCases/addressUseCase";
import { OrderUseCase } from "../../core/useCases/orderUseCase";
import Razorpay from "razorpay";
// user controller

// configuring razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
export class UserController {
  constructor(
    private authService: AuthService,
    private generateToken: GenerateToken,
    private productUseCase: ProductUseCase,
    private cartUseCase: CartUseCase,
    private addressUseCase: AddressUseCase,
    private orderUseCase: OrderUseCase,
    private emailSender: EmailSender
  ) {
    this.postSignup = this.postSignup.bind(this);
    this.postLogin = this.postLogin.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.getProduct = this.getProduct.bind(this);
    this.getCart = this.getCart.bind(this);
    this.addItem = this.addItem.bind(this);
    this.createAddress = this.createAddress.bind(this);
    this.getAddress = this.getAddress.bind(this);
    this.editAddress = this.editAddress.bind(this);
    this.deleteAddress = this.deleteAddress.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.getOrderHistory = this.getOrderHistory.bind(this);
    this.contact = this.contact.bind(this);
    this.getRecentOrders = this.getRecentOrders.bind(this);
    this.updateUserProfile = this.updateUserProfile.bind(this);
    this.removeCartItem = this.removeCartItem.bind(this);
    this.createRazorPayOrder = this.createRazorPayOrder.bind(this);
    this.verifyPayment = this.verifyPayment.bind(this);
    this.returnCancelOrder = this.returnCancelOrder.bind(this);
  }
  // controller for signup
  async postSignup(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, phoneNumber } = req.body;
      console.log("username", username);
      if (!username || !email || !password || !phoneNumber) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      const user = await this.authService.signup(
        username,
        email,
        password,
        phoneNumber
      );
      if (user) {
        res.status(201).json({
          message: "user created successfully",
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phoneNumber,
          },
        });
      }
    } catch (error: any) {
      console.error("error", error);
      res.status(400).json({ error: error.message });
    }
  }

  // controller for login
  async postLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await this.authService.login(email, password);
      const token = await this.generateToken.generate(email);
      if (user) {
        res.status(202).json({
          message: "user logged in successfully",
          token: token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phoneNumber,
          },
        });
      }
    } catch (error: any) {
      console.error("error", error);
      res.status(400).json({ error: error.message });
    }
  }

  // controller for getting all the products
  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.productUseCase.getAllProduct();
      res.status(202).json({ products: product });
      return;
    } catch (error) {
      console.error("error", error);
      res.status(500).json("internal server error");
      return;
    }
  }

  // controller for getting specific product
  async getProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productUseCase.getProduct(id);
      res.status(200).json({ product: product });
      return;
    } catch (error) {
      console.error("error", error);
      res.status(500).json("internal server error");
      return;
    }
  }

  // controller for getting the cart data
  async getCart(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      console.log("user id", id);
      const cart = await this.cartUseCase.getCart(id);
      res.status(200).json({ cart: cart });
    } catch (error) {
      console.error("error", error);
      res.status(500).json("internal server error");
      return;
    }
  }

  // controller for adding new item to the cart
  async addItem(req: Request, res: Response): Promise<any> {
    try {
      const { userId, productId, quantity } = req.body;
      const newItem = await this.cartUseCase.addItem({
        userId,
        productId,
        quantity,
      });
      if (!newItem.success) {
        return res.status(400).json({ cart: newItem });
      }
      res.status(201).json({ cart: newItem });
    } catch (error) {
      console.error("error", error);
      res.status(500).json("internal server error");
      return;
    }
  }

  // controller for adding new address
  async createAddress(req: Request, res: Response) {
    try {
      const {
        userId,
        addresseeName,
        addresseePhone,
        fullAddress,
        locality,
        pincode,
        state,
        city,
      } = req.body;
      const newAddress = await this.addressUseCase.createAddress(
        userId,
        addresseeName,
        addresseePhone,
        fullAddress,
        locality,
        pincode,
        state,
        city
      );
      console.log("new address", newAddress);
      if (!newAddress.success) {
        res.status(400).json({ address: newAddress });
      }
      res.status(201).json({ address: newAddress });
    } catch (error) {
      console.error("error", error);
      res.status(500).json("internal server error");
      return;
    }
  }

  // controller for showing all the address of the users
  async getAddress(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const savedAddress = await this.addressUseCase.findAddress(id);
      if (!savedAddress.success) {
        res.status(400).json({ savedAddress: savedAddress });
      }
      res.status(200).json(savedAddress);
    } catch (error) {
      console.error("error", error);
      res.status(500).json("internal server error");
    }
  }

  // controller for editing the address of the user
  async editAddress(req: Request, res: Response) {
    try {
      const { id, addressId } = req.params;
      const {
        addresseeName,
        addresseePhone,
        fullAddress,
        locality,
        pincode,
        state,
        city,
      } = req.body;
      // use case for the addressUseCase
      const editedAddress = await this.addressUseCase.editAddress(
        id,
        addressId,
        addresseeName,
        addresseePhone,
        fullAddress,
        locality,
        pincode,
        state,
        city
      );

      res.status(200).json(editedAddress);
    } catch (error) {
      console.error("error", error);
      res.status(500).json("internal server error");
    }
  }

  // controller for removing the address
  async deleteAddress(req: Request, res: Response): Promise<any> {
    try {
      const { addressId } = req.params;
      const address = await this.addressUseCase.removeAddress(addressId);
      if (!address.success) {
        return res.status(400).json({
          message: "bad request",
          success: address.success,
        });
      }

      return res.status(200).json({
        message: address.message,
        success: address.success,
      });
    } catch (error) {
      res.status(500).json({ error: "internal server error" });
    }
  }

  // controller for creating the order
  async createOrder(req: Request, res: Response): Promise<any> {
    try {
      const { userId, addressId, items, paymentMethod, totalAmount } = req.body;
      console.log(
        "logging the data",
        userId,
        addressId,
        items,
        paymentMethod,
        totalAmount
      );
      const date = new Date();
      const result = await this.orderUseCase.createOrder(
        userId,
        totalAmount,
        paymentMethod,
        addressId,
        date
      );
      if (!result) {
        return res.status(400).json({ message: "failed to place the order" });
      }
      res.status(201).json({ message: "order placed successfully..." });
    } catch (error) {
      console.error("error while adding the product from controller", error);
      res.status(500).json({ error: "internal server error" });
    }
  }

  // controller for getting the order history page
  async getOrderHistory(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      console.log("user id", id);
      const result = await this.orderUseCase.findOrder(id);
      if (!result) {
        return res
          .status(400)
          .json({ message: "Unable to get the order history for the user" });
      }
      res
        .status(202)
        .json({ data: result, message: "fetched the data successfully" });
    } catch (error) {
      console.error("error", error);
      res.status(500).json({ error: error });
    }
  }

  // controller for sending the mail from the client to us
  async contact(req: Request, res: Response): Promise<any> {
    try {
      const { email, first_name, last_name, phone, message } = req.body;
      console.log(
        "content in the req.body",
        email,
        first_name,
        last_name,
        phone,
        message
      );
      if (!email || !first_name || !last_name || !phone || !message) {
        return res.status(400).json({ message: "all fields are required" });
      }
      const result = await this.emailSender.sendFeedback(
        email,
        first_name,
        last_name,
        phone,
        message
      );
      if (!result.success) {
        return res
          .status(400)
          .json({ message: "error while sending the email" });
      }
      res.status(200).json({ message: "Email send successfully" });
    } catch (error) {
      console.error("error sending the mail");
      res.status(500).json({ message: error });
    }
  }

  // for getting the last 3 order details for the user
  async getRecentOrders(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const result = await this.orderUseCase.getRecentOrders(id);
      if (!result?.success) {
        return res.status(400).json({ message: "something went wrong" });
      }
      res
        .status(202)
        .json({ addresses: result.address, orders: result?.orders });
    } catch (error) {
      console.error("error from controller", error);
      res.status(500).json({ message: error });
    }
  }

  // for updating the profile for the user
  async updateUserProfile(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { username, email, phoneNumber } = req.body;
      console.log("controller", username, email, phoneNumber);
      const result = await this.authService.updateProfile(
        id,
        username,
        email,
        phoneNumber
      );
      if (!result.success) {
        return res.status(400).json({ message: "user not updated" });
      }
      res.status(200).json({ data: result.data });
    } catch (error) {
      console.error("error from controller", error);
      res.status(500).json({ message: error });
    }
  }

  // for removing item in the cart
  async removeCartItem(req: Request, res: Response): Promise<any> {
    try {
      const { cartId, userId } = req.params;
      console.log("cart, user", cartId, userId);
      console.log("inside");
      const result = await this.cartUseCase.removeItem(cartId, userId);
      console.log("result from controller", result);
      if (!result.success) {
        return res.status(400).json("item not removed");
      }
      res.status(202).json(result.cart);
    } catch (error) {
      console.error("error", error);
      res.status(500).json({ error: error });
    }
  }

  // for creating order in the razorpay
  async createRazorPayOrder(req: Request, res: Response): Promise<any> {
    try {
      const { amount, userId, username, email, phone } = req.body;

      if (!userId || !username || !email || !phone) {
        return res
          .status(400)
          .json({ success: false, message: "User details missing" });
      }
      // creating the order
      const orders = await razorpay.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: { userId, username, email, phone },
      });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  // controller for verifying the payment
  async verifyPayment(req: Request, res: Response): Promise<any> {
    try {
      const { orderData, response } = req.body;

      console.log("req.body", orderData, response);
      const secret = process.env.RAZORPAY_KEY_SECRET;
      if (!secret) {
        throw new Error("secret key not found");
      }
      const generatedSignature = crypto
        .createHmac("sha256", secret)
        .update(response.razorpay_order_id + "|" + response.razorpay_payment_id)
        .digest("hex");

      const { userId, addressId, items, paymentMethod, totalAmount } =
        orderData;
      console.log(
        `userid ${userId}, addressId ${addressId}, items ${items}, payment method ${paymentMethod}, total amount${totalAmount}`
      );
      const date = new Date();
      const result = await this.orderUseCase.createOrder(
        userId,
        totalAmount,
        paymentMethod,
        addressId,
        date
      );

      if (!result) {
        return res.status(400).json({ message: "failed to place the order" });
      }

      console.log("generate", generatedSignature);
      console.log("razorpay signature", response.razorpay_signature);
      if (generatedSignature === response.razorpay_signature) {
        res.json({ success: true, message: "Payment verified successfully" });
      } else {
        res.status(400).json({ success: false, message: "Invalid signature" });
      }
    } catch (error) {
      console.error("error", error);
      res.status(500).json({ error: error });
    }
  }

  // for returning and cancelling the order
  async returnCancelOrder(req: Request, res: Response): Promise<any> {
    try {
      const { username, email, reason, orderStatus } = req.body;
      const { userId, orderId } = req.params;

      console.log("reason", req.body);
      if (!username || !email || !reason || !orderStatus) {
        return res
          .status(400)
          .json({ message: "All the fields are mandatory" });
      }
      const sendMail = await this.emailSender.returnCancelOrder(
        email,
        username,
        reason,
        orderStatus,
        orderId
      );
      if (!sendMail) {
        return res
          .status(400)
          .json({ message: "Issue while sending your response" });
      }
      res.status(202).json({ message: "Your reason submitted" });
    } catch (error) {
      console.error("error", error);
      res.status(500).json({ error: error });
    }
  }
}
