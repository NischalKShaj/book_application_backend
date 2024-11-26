// <============================== file for creating the interface for the Product functionality ===============>

// importing the required modules
import { Product } from "../entities/product/product";

// creating the interface for the IUserRepository
export interface IProductRepository {
  getAllProduct(): Promise<Product[] | null>;
  addProduct(product: Product): Promise<Product>;
  checkProduct(bookName: string): Promise<Product | null>;
  getProduct(id: string): Promise<Product | null>;
  updateStock(id: string, stock: number): Promise<Product>;
}
