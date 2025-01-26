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
import { AddressRepository } from "../../infrastructure/repository/addressRepository";
import { AddressUseCase } from "../../core/useCases/addressUseCase";

// creating the router instance
const router = express.Router();

// injecting the dependencies
const userRepository = new UserRepository();
const passwordService = new PasswordService();
const generateToken = new GenerateToken();
const productRepository = new ProductRepository();
const productUseCase = new ProductUseCase(productRepository);
const cartRepository = new CartRepository();
const addressRepository = new AddressRepository();
const cartUseCase = new CartUseCase(
  cartRepository,
  productRepository,
  userRepository
);
const userUseCase = new UserUseCase(userRepository, passwordService);
const addressUseCase = new AddressUseCase(addressRepository, userRepository);
const authService = new AuthService(userUseCase);
const userController = new UserController(
  authService,
  generateToken,
  productUseCase,
  cartUseCase,
  addressUseCase
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

// router for adding the product to the cart
router.post("/cart/add-item", userController.addItem);

// router for moving to the checkout page
router.post("/add-address", userController.createAddress);

// router for getting the address of the user
router.get("/address/:id", userController.getAddress);

// exporting the router
export default router;
