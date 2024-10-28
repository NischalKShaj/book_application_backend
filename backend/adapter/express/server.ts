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
  try {
    await connection();
    app.listen(port, () => {
      console.log(`server running on : http://localhost:${port}`);
    });
  } catch (error) {
    console.error("error", error);
  }
};

server();
