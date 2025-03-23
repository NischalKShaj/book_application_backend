// <============================== file for creating the interface for the Product functionality ===============>

// importing the required modules
import { Product } from "../entities/product/product";

// creating the interface for the IUserRepository
export interface IProductRepository {
  getAllProduct(pageNumber: Number, limit: Number): Promise<Product[] | null>;
  addProduct(product: Product): Promise<Product>;
  checkProduct(bookName: string): Promise<Product | null>;
  getProduct(id: string): Promise<Product | null>;
  updateStock(id: string, stock: number): Promise<Product>;
  editProduct(id: string, update: Partial<Product>): Promise<Product | null>;
  removeProduct(id: string): Promise<boolean>;
}
