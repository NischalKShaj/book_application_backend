// <========================== file to create the route for the admin side ================>

// importing the required modules
import express, { Request, Response } from "express";
import { AdminRepository } from "../../infrastructure/repository/adminRepository";
import { GenerateToken } from "../../application/services/generateToken";
import { AdminUseCase } from "../../core/useCases/adminUseCase";
import { AdminAuthService } from "../../application/services/adminAuthService";
import { AdminController } from "../../application/controller/adminController";
import { ProductUseCase } from "../../core/useCases/productUseCase";
import { ProductRepository } from "../../infrastructure/repository/productRepository";
import { uploadImage } from "../middleware/multer";
import { authenticateUserJwt } from "../middleware/authToken";
import { UserUseCase } from "../../core/useCases/userUseCase";
import { UserRepository } from "../../infrastructure/repository/userRepository";
import { PasswordService } from "../../infrastructure/services/passwordServices";

// creating the router instance
const router = express.Router();

// adding dependency injection
const adminRepository = new AdminRepository();
const userRepository = new UserRepository();
const passwordService = new PasswordService();
const userUseCase = new UserUseCase(userRepository, passwordService);
const productRepository = new ProductRepository();
const generateToken = new GenerateToken();
const productUseCase = new ProductUseCase(productRepository);
const adminUseCase = new AdminUseCase(adminRepository);
const adminAuthService = new AdminAuthService(adminUseCase);
const adminController = new AdminController(
  adminAuthService,
  generateToken,
  productUseCase,
  userUseCase
);

// creating the route for the admin dashboard
router.get("/", async (req: Request, res: Response) => {
  res.send("admin dashboard");
});

// route for the login purpose
router.post("/login", adminController.postLogin);

// route for getting all the products
router.get("/products", adminController.getProducts);

// route for adding new product
router.post(
  "/products/add",
  authenticateUserJwt,
  uploadImage,
  adminController.addProduct
);

// router for getting all the users
router.get("/get-all-users", adminController.getAllUsers);

// exporting the router for the admin
export default router;
