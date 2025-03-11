// <============== file to create the order management schema =================>

// creating the class
export class Order {
  constructor(
    public _id: string,
    public userId: string,
    public cartId: Array<string>,
    public products: Array<{
      productId: string;
      bookName: string;
      images: string[];
      amount: number;
      quantity: number;
    }>,
    public totalAmount: number,
    public addressId: string,
    public status:
      | "pending"
      | "shipped"
      | "out for delivery"
      | "delivered"
      | "canceled"
      | "returned",
    public paymentMethod: string,
    public createdAt: Date,
    public updatedAt: Date,
    public isCancel: boolean
  ) {}
}
