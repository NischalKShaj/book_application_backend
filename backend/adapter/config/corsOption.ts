// <========================= file to enable the cors for the application ===============>

// importing the required modules
import dotenv from "dotenv";
dotenv.config();

// setting the base url
const baseUrl = process.env.BASE_URL;
console.log(baseUrl);

if (!baseUrl) {
  throw new Error("base url not found");
}

// creating the options for the cors
export const corsOptions = {
  origin: baseUrl,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS", "HEAD"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  credentials: true,
};
