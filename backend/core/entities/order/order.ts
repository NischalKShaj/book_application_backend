// <============== file to create the order management schema =================>

// creating the class
export class Order {
  constructor(
    public _id: string,
    public userId: string,
    public cartId: string,
    public products: Array<{
      productId: string;
      images: string[];
      quantity: number;
      amount: number;
    }>,
    public quantity: number,
    public totalAmount: number,
    public addressId: string,
    public status: "pending" | "shipped" | "out for delivery" | "delivered",
    public paymentMethod: "COD" | "Online Payment" | "Wallet"
  ) {}
}
