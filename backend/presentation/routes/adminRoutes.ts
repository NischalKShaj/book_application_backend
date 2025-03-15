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
import { OrderRepository } from "../../infrastructure/repository/orderRepository";
import { OrderUseCase } from "../../core/useCases/orderUseCase";
import { CartRepository } from "../../infrastructure/repository/cartRepository";
import { AddressRepository } from "../../infrastructure/repository/addressRepository";

// creating the router instance
const router = express.Router();

// adding dependency injection
const orderRepository = new OrderRepository();
const adminRepository = new AdminRepository();
const userRepository = new UserRepository();
const passwordService = new PasswordService();
const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
const addressRepository = new AddressRepository();
const orderUseCase = new OrderUseCase(
  orderRepository,
  userRepository,
  cartRepository,
  productRepository,
  addressRepository
);
const userUseCase = new UserUseCase(
  userRepository,
  passwordService,
  addressRepository
);
const generateToken = new GenerateToken();
const productUseCase = new ProductUseCase(productRepository);
const adminUseCase = new AdminUseCase(adminRepository);
const adminAuthService = new AdminAuthService(adminUseCase);
const adminController = new AdminController(
  adminAuthService,
  generateToken,
  productUseCase,
  userUseCase,
  orderUseCase
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

// router for getting the product
router.get("/product/:id", adminController.getProduct);

// router for updating the product
router.put("/edit-product/:id", uploadImage, adminController.editProduct);

// router for deleting the product
router.delete("/delete/product/:id", adminController.removeProduct);

// router for getting all the orders
router.get("/order-details", adminController.getOrders);

// router for updating the order status
router.patch("/update-order-status/:id", adminController.updateOrderStatus);

// router for showing the orders based on the status
router.post("/orders/:status", adminController.showOrderStatus);

// exporting the router for the admin
export default router;
