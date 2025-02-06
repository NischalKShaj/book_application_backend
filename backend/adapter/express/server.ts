// <======================== file for the server ======================>

// importing the required modules
import dotenv from "dotenv";
import app from "./app";
import { connection } from "../../infrastructure/database/mongoConnect";
dotenv.config();

// setting the port
const port = process.env.PORT || 4000;

// starting the server
const server = async () => {
  while (true) {
    try {
      await connection();
      app.listen(port, () => {
        console.log(`🚀 Server running on: http://localhost:${port}`);
      });
      break;
    } catch (error) {
      console.error("❌ Error while starting the server:", error);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

server();
