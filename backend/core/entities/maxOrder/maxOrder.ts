// <============== file to create the order management schema =================>

// creating the class
export class MaxOrder {
  constructor(
    public _id: string,
    public date: Date,
    public number_of_order: Number
  ) {}
}
