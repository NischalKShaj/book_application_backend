// <============== file to create the order management schema =================>

// creating the class for the schema
export class Address {
  constructor(
    public _id: string,
    public userId: string,
    public fullAddress: string,
    public locality: string,
    public pincode: number,
    public city: string,
    public state: string
  ) {}
}
