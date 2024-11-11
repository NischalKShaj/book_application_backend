// <=============== file to create the admin controller ===================>

// importing the required modules
import { Request, Response } from "express";
import { AdminAuthService } from "../services/adminAuthService";
import { GenerateToken } from "../services/generateToken";
import { ProductUseCase } from "../../core/useCases/productUseCase";

// creating the class for the admin controller
export class AdminController {
  constructor(
    private adminAuthService: AdminAuthService,
    private generateToken: GenerateToken,
    private productUseCase: ProductUseCase
  ) {
    this.postLogin = this.postLogin.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.addProduct = this.addProduct.bind(this);
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
}
