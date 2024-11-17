// <======================= file to create the class for the schema of cart ==============>

// creating the class
export class Cart {
  constructor(
    public _id: string,
    public productId: string,
    public bookName: string,
    public amount: number,
    public userId: string,
    public images: string[],
    public quantity: number
  ) {}
}
