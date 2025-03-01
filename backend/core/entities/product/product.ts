// <=========================================== creating the class for the schema for the product ================>

// importing the required modules

// creating the class
export class Product {
  constructor(
    public _id: string,
    public bookName: string,
    public bookDescription: string,
    public amount: number,
    public stock: number,
    public images: string[]
  ) {}
}
