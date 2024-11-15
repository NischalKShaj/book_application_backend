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
      // for checking if the product already exist in the db
      const existingProduct = await this.productRepository.checkProduct(
        productData.bookName
      );
      if (existingProduct) {
        throw new Error("product already exist");
      }

      const newProduct = new Product(
        Date.now().toString(),
        productData.bookName,
        productData.bookDescription,
        productData.amount,
        productData.stock,
        productData.images
      );

      await this.productRepository.addProduct(newProduct);
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
