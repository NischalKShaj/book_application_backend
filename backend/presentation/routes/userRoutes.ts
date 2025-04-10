// <============= file to create the user routes ====================>

// importing the required modules
import express, { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/repository/userRepository";
import { UserController } from "../../application/controller/userController";
import { UserUseCase } from "../../core/useCases/userUseCase";
import { AuthService } from "../../application/services/authServices";
import { PasswordService } from "../../infrastructure/services/passwordServices";
import { EmailSender } from "../../application/services/emailService";
import { GenerateToken } from "../../application/services/generateToken";
import { ProductUseCase } from "../../core/useCases/productUseCase";
import { ProductRepository } from "../../infrastructure/repository/productRepository";
import { CartRepository } from "../../infrastructure/repository/cartRepository";
import { CartUseCase } from "../../core/useCases/cartUseCase";
import { AddressRepository } from "../../infrastructure/repository/addressRepository";
import { AddressUseCase } from "../../core/useCases/addressUseCase";
import { OrderRepository } from "../../infrastructure/repository/orderRepository";
import { OrderUseCase } from "../../core/useCases/orderUseCase";
import { PhoneNumberVerification } from "../../application/services/twilioService";

// creating the router instance
const router = express.Router();

// injecting the dependencies
const userRepository = new UserRepository();
const passwordService = new PasswordService();
const emailService = new EmailSender();
const phoneNumberVerification = new PhoneNumberVerification();
const generateToken = new GenerateToken();
const productRepository = new ProductRepository();
const orderRepository = new OrderRepository();
const productUseCase = new ProductUseCase(productRepository);
const cartRepository = new CartRepository();
const addressRepository = new AddressRepository();
const orderUseCase = new OrderUseCase(
  orderRepository,
  userRepository,
  cartRepository,
  productRepository,
  addressRepository
);
const cartUseCase = new CartUseCase(
  cartRepository,
  productRepository,
  userRepository
);
const userUseCase = new UserUseCase(
  userRepository,
  passwordService,
  addressRepository
);
const addressUseCase = new AddressUseCase(addressRepository, userRepository);
const authService = new AuthService(userUseCase);
const userController = new UserController(
  authService,
  generateToken,
  productUseCase,
  cartUseCase,
  addressUseCase,
  orderUseCase,
  emailService,
  userUseCase,
  phoneNumberVerification
);

// route for home page
router.get("/", async (req: Request, res: Response) => {
  res.send("home page");
});

// route for posting the login page
router.post("/login", userController.postLogin);

// route for posting the signup page
router.post("/signup", userController.postSignup);

// router for getting the otp
router.post("/otp", userController.getOtp);

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

// router for editing the address of the user
router.put("/update-address/:id/:addressId", userController.editAddress);

// router for deleting the address for a user
router.delete("/remove-address/:addressId", userController.deleteAddress);

// router for creating order for the user
// router.post("/cart/confirm-order", userController.createOrder);

// router for removing the item from the cart
router.delete("/remove-item/:cartId/:userId", userController.removeCartItem);

// router for showing the orders in the order history page
router.get("/orders/:id", userController.getOrderHistory);

// router for sending the contact
router.post("/contact", userController.contact);

// router for getting the data in the profile page
router.get("/profile-data/:id", userController.getRecentOrders);

// router for updating the profile for the user
router.put("/update-profile/:id", userController.updateUserProfile);

// router for online payment
router.post("/online-payment", userController.createRazorPayOrder);

// router for confirming the payment
router.post("/api/payment-success", userController.verifyPayment);

// router for updating the quantity of the product in the cart
router.patch("/update-cart-quantity", userController.changeQuantity);

// router for downloading the invoice
router.get("/order/invoice/:orderId/:userId", userController.downloadInvoice);

// router for checking the max order per day
router.get("/check-max-order", userController.getMaxOrders);

// router for cancelling and returning the product
// router.post(
//   "/order/return-cancel/:userId/:orderId",
//   userController.returnCancelOrder
// );

// exporting the router
export default router;
