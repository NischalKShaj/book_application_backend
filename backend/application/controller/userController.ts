// <============================ file to create the controller for the user =================>

// importing the required modules
import { Request, Response } from "express";
import { AuthService } from "../services/authServices";
import { GenerateToken } from "../services/generateToken";
import { ProductUseCase } from "../../core/useCases/productUseCase";
import { CartUseCase } from "../../core/useCases/cartUseCase";
import { AddressUseCase } from "../../core/useCases/addressUseCase";

// user controller
export class UserController {
  constructor(
    private authService: AuthService,
    private generateToken: GenerateToken,
    private productUseCase: ProductUseCase,
    private cartUseCase: CartUseCase,
    private addressUseCase: AddressUseCase
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
}
