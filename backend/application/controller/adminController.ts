// <=============== file to create the admin controller ===================>

// importing the required modules
import { Request, Response } from "express";
import { AdminAuthService } from "../services/adminAuthService";
import { GenerateToken } from "../services/generateToken";
import { ProductUseCase } from "../../core/useCases/productUseCase";
import { UserUseCase } from "../../core/useCases/userUseCase";

// creating the class for the admin controller
export class AdminController {
  constructor(
    private adminAuthService: AdminAuthService,
    private generateToken: GenerateToken,
    private productUseCase: ProductUseCase,
    private userUseCase: UserUseCase
  ) {
    this.postLogin = this.postLogin.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.addProduct = this.addProduct.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.getProduct = this.getProduct.bind(this);
    this.editProduct = this.editProduct.bind(this);
    this.removeProduct = this.removeProduct.bind(this);
  }
  // controller for the admin login
  async postLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const admin = await this.adminAuthService.adminLogin(email, password);
      if (!admin) {
        res.status(403).json("invalid credentials");
        return;
      }
      const token = await this.generateToken.generate(email);
      res
        .cookie("admin_access_token", token, { httpOnly: true })
        .status(202)
        .json({ email: email, token: token });
      return;
    } catch (error) {
      console.error("error", error);
      res.status(500).json("internal server error");
      return;
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

  // controller for adding new product
  async addProduct(req: Request, res: Response): Promise<void> {
    try {
      const { bookName, bookDescription, amount, stock } = req.body;
      const imageUrls = req.body.imageUrls;
      console.log("req.body", req.body);
      console.log("image Urls", imageUrls);
      if (!bookName || !bookDescription || !amount || !stock) {
        res.status(400).json({ message: "required fields are missing" });
        return;
      }
      if (imageUrls.length === 0) {
        res.status(400).json({ message: "no images found" });
        return;
      }
      const newProduct = await this.productUseCase.addProduct({
        bookName: bookName,
        bookDescription: bookDescription,
        amount: amount,
        stock: stock,
        images: imageUrls,
      });
      res
        .status(201)
        .json({ message: "product added successfully", product: newProduct });
    } catch (error) {
      console.error("error", error);
      res.status(500).json("internal server error");
      return;
    }
  }

  // for getting all the users
  async getAllUsers(req: Request, res: Response): Promise<any> {
    try {
      console.log("inside");
      const allUsers = await this.userUseCase.getAllUsers();
      if (!allUsers) {
        return res.status(400).json({ message: "No users found" });
      }
      res.status(200).json({ users: allUsers.data });
    } catch (error) {
      console.error("error from controller", error);
      res.status(500).json({ error: error });
    }
  }

  // for getting the particular product
  async getProduct(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      console.log("inside");
      const product = await this.productUseCase.getProduct(id);
      if (!product) {
        return res.status(400).json({ message: "No product found" });
      }
      res.status(202).json({ product: product });
    } catch (error) {
      console.error("error", error);
      res.status(500).json({ error: error });
    }
  }

  // for updating the product
  async editProduct(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      console.log("id", id);

      const existingProduct = await this.productUseCase.getProduct(id);

      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Extract fields from request body, use existing values if not provided
      const {
        bookName = existingProduct.bookName,
        bookDescription = existingProduct.bookDescription,
        amount = existingProduct.amount,
        stock = existingProduct.stock,
      } = req.body;

      // Handle images
      let imageUrls = existingProduct.images; // Keep old images by default
      if (req.body.imageUrls && req.body.imageUrls.length > 0) {
        imageUrls = req.body.imageUrls; // Replace with new images if uploaded
      }

      // Update the product in the database
      const updatedProduct = await this.productUseCase.editProduct(id, {
        bookName,
        bookDescription,
        amount,
        stock,
        images: imageUrls,
      });
      res.status(200).json({ data: updatedProduct });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error: error });
    }
  }

  // for deleting the product from the db
  async removeProduct(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const result = await this.productUseCase.removeProduct(id);
      if (!result) {
        return res.status(400).json({ message: "Product not removed" });
      }
      res.status(200).json({ message: "Product removed successfully" });
    } catch (error) {
      console.error("error", error);
      res.status(500).json({ error: error });
    }
  }
}
