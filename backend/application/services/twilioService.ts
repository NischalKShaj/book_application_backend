// file to create otp page for twilio

// importing the required module
import twilio from "twilio";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();
import { otp as OtpModel } from "../../infrastructure/database/schema/otpSchema";

// setting up the clients
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// function for creating otp

// function for creating the opt
const generateOTP = (length: number) => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, digits.length);
    otp += digits[randomIndex];
  }
  console.log("otp is ", otp);
  return otp;
};

// creating class for the phone number
export class PhoneNumberVerification {
  // setting up the function for sending the otp
  async sendOTP(phoneNumber: string) {
    try {
      console.log("inside the otp");
      const otp = generateOTP(4);
      await OtpModel.create({ phoneNumber: phoneNumber, otp: otp });
      console.log("otp", otp);
      const message = await client.messages.create({
        body: `Your verification code is ${otp}. Please enter this code within 2 minutes to complete your authentication. Do not share this code with anyone.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber, // Must include country code (e.g., +919876543210)
      });

      console.log("OTP sent successfully:", message.sid);
      return { success: true, sid: message.sid, otp: otp };
    } catch (error) {
      console.error("Error sending OTP:", error);
      return { success: false, error };
    }
  }
}
