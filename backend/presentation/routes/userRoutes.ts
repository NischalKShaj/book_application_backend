// <============= file to create the user routes ====================>

// importing the required modules
import express, { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/repository/userRepository";
import { UserController } from "../../application/controller/userController";
import { UserUseCase } from "../../core/useCases/userUseCase";
import { AuthService } from "../../application/services/authServices";
import { PasswordService } from "../../infrastructure/services/passwordServices";
import { GenerateToken } from "../../application/services/generateToken";
import { ProductUseCase } from "../../core/useCases/productUseCase";
import { ProductRepository } from "../../infrastructure/repository/productRepository";
import { CartRepository } from "../../infrastructure/repository/cartRepository";
import { CartUseCase } from "../../core/useCases/cartUseCase";

// creating the router instance
const router = express.Router();

// injecting the dependencies
const userRepository = new UserRepository();
const passwordService = new PasswordService();
const generateToken = new GenerateToken();
const productRepository = new ProductRepository();
const productUseCase = new ProductUseCase(productRepository);
const cartRepository = new CartRepository();
const cartUseCase = new CartUseCase(cartRepository);
const userUseCase = new UserUseCase(userRepository, passwordService);
const authService = new AuthService(userUseCase);
const userController = new UserController(
  authService,
  generateToken,
  productUseCase,
  cartUseCase
);

// route for home page
router.get("/", async (req: Request, res: Response) => {
  res.send("home page");
});

// route for posting the login page
router.post("/login", userController.postLogin);

// route for posting the signup page
router.post("/signup", userController.postSignup);

// route for seeing all the products
router.get("/products", userController.getProducts);

// router for getting a specific product
router.get("/product/:id", userController.getProduct);

// router for getting the cart
router.get("/cart/:id", userController.getCart);

// exporting the router
export default router;
