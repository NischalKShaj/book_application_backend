// <====================== file to create class for the schema for the user =============>

// importing the required modules

// creating the class for the user
export class User {
  constructor(
    public _id: string,
    public username: string,
    public email: string,
    public password: string,
    public phoneNumber: string
  ) {}
}
