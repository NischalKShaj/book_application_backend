// <=========== file to create the service for the email =============>

// importing the required modules
import dotenv from "dotenv";
import createTransport from "nodemailer";
dotenv.config();

// setting up the nodemailer class
export class EmailSender {
  // for sending the mail to the team from the user
  async sendFeedback(
    from: string,
    first_name: string,
    last_name: string,
    phone: string,
    message: string
  ) {
    try {
      // setting up the transporter
      const transporter = createTransport.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      /* The code snippet you provided is part of a method in the `EmailSender` class that is
     responsible for sending feedback emails. Here's a breakdown of what it does: */
      let subject = `Feedback from ${first_name} ${last_name} ${phone}`;

      // configuring the mail options
      const mailOptions = {
        from: from,
        to: process.env.EMAIL,
        subject,
        text: message,
      };

      // sending the mail
      const info = await transporter.sendMail(mailOptions);
      console.log("information", info);
      return { success: true };
    } catch (error) {
      console.error("error", error);
      throw new Error(error as string);
    }
  }

  // for generating the otp for the user signup and sending the otp to both mail and phone
  async sendOTP(req: Request, res: Response) {}

  // for sending the reason for cancelling or returning the product
  async returnCancelOrder(
    from: string,
    username: string,
    reason: string,
    orderStatus: string,
    orderId: string
  ) {
    try {
      let text;
      let subject;
      if (orderStatus === "delivered") {
        subject = `Request for return from ${username}`;
        text = `${username} has requested to return the product for order ID ${orderId}. The reason is: ${reason}`;
      } else {
        subject = `Request for cancel from ${username}`;
        text = `${username} has requested to cancel the product for order ID ${orderId}. The reason is: ${reason}`;
      }

      // setting up the transporter
      const transporter = createTransport.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      // configuring the mail options
      const mailOptions = {
        from: from,
        to: process.env.EMAIL,
        subject,
        text: text,
      };

      // sending the mail
      const info = await transporter.sendMail(mailOptions);
      console.log("information", info);
      return { success: true };
    } catch (error) {
      console.error("error", error);
      throw new Error(error as string);
    }
  }
}
