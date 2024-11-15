// <============================= creating the file for the product repository ==================>

// importing the required modules
import { Product } from "../../core/entities/product/product";
import { IProductRepository } from "../../core/repository/IProductRepository";
import { product as ProductModel } from "../database/schema/productSchema";

// creating the repository for the products
export class ProductRepository implements IProductRepository {
  // for getting all the products from the db
  async getAllProduct(): Promise<Product[] | null> {
    try {
      const products = await ProductModel.find().lean();
      if (products.length <= 0) {
        return null;
      }
      return products.map(
        (prod): Product => ({
          _id: prod._id.toString(),
          bookName: prod.bookName,
          bookDescription: prod.bookDescription,
          amount: prod.amount,
          stock: prod.stock,
          images: prod.images,
        })
      );
    } catch (error) {
      console.error("error", error);
      throw new Error("no products found");
    }
  }

  // for adding a new product
  async addProduct(productData: {
    bookName: string;
    bookDescription: string;
    amount: number;
    stock: number;
    images: string[];
  }): Promise<Product> {
    try {
      const newProduct = await ProductModel.create({
        bookName: productData.bookName,
        bookDescription: productData.bookDescription,
        amount: productData.amount,
        stock: productData.stock,
        images: productData.images,
      });

      const productObject = newProduct.toObject();

      return {
        _id: productObject._id.toString(),
        bookName: productObject.bookName,
        bookDescription: productObject.bookDescription,
        amount: productObject.amount,
        stock: productObject.stock,
        images: productObject.images,
      };
    } catch (error) {
      console.error("error");
      throw new Error(error as string);
    }
  }

  // for checking the existence of a product
  async checkProduct(bookName: string): Promise<Product | null> {
    try {
      const product = await ProductModel.findOne({ bookName: bookName });
      return product
        ? new Product(
            product._id.toString(),
            product.bookName,
            product.bookDescription,
            product.stock,
            product.amount,
            product.images
          )
        : null;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // for getting a specific product based on id
  async getProduct(id: string): Promise<Product | null> {
    try {
      const product = await ProductModel.findById({ _id: id });
      if (!product) {
        return null;
      }
      return {
        _id: product._id.toString(),
        bookName: product.bookName,
        bookDescription: product.bookDescription,
        amount: product.amount,
        stock: product.stock,
        images: product.images,
      };
    } catch (error) {
      console.error("error", error);
      throw new Error(error as string);
    }
  }
}
