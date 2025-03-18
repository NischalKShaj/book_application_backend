// <====================== file to create class for the schema for the user =============>

// importing the required modules

// creating the class for the user
export class Otp {
  constructor(
    public _id: string,
    public phoneNumber: string,
    public otp: number
  ) {}
}
