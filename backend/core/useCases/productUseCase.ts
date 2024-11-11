// <===================== file for the use case for the product ==============>

// importing the required modules
import { Product } from "../entities/product/product";
import { IProductRepository } from "../repository/IProductRepository";

// creating the class for the product use case
export class ProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  // function for the use case for the product repo
  async getAllProduct(): Promise<Product[] | null> {
    try {
      const product = await this.productRepository.getAllProduct();
      return product;
    } catch (error) {
      console.error("error", error);
      throw new Error("something went wrong");
    }
  }
  // function for adding new product
  async addProduct(productData: {
    bookName: string;
    bookDescription: string;
    amount: number;
    stock: number;
    images: string[];
  }): Promise<Product> {
    try {
      const newProduct = await this.productRepository.addProduct(productData);
      return newProduct;
    } catch (error) {
      console.error("error", error);
      throw new Error(error as string);
    }
  }

  // function for getting one product
  async getProduct(id: string): Promise<Product | null> {
    try {
      const product = await this.productRepository.getProduct(id);
      return product;
    } catch (error) {
      console.error("error", error);
      throw new Error(error as string);
    }
  }
}
