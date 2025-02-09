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
}
