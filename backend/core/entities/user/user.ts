// <====================== file to create the schema for the user =============>

// importing the required modules
export class User {
  constructor(
    public _id: string,
    public username: string,
    public email: string,
    public password: string,
    public phoneNumber: string
  ) {}
}
