// <============================== file for creating the interface for the Product functionality ===============>

// importing the required modules
import { Product } from "../entities/product/product";

// creating the interface for the IUserRepository
export interface IProductRepository {
  getAllProduct(): Promise<Product[] | null>;
  addProduct(productData: {
    bookName: string;
    bookDescription: string;
    amount: number;
    stock: number;
    images: string[];
  }): Promise<Product>;
  getProduct(id: string): Promise<Product | null>;
}
