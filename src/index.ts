import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { router as authRouter } from "./routes/auth.routes.js";
import { connectDb } from "./db/connect.js";

const app = express();

// Connecting database with server
connectDb();

dotenv.config();

// Handle POST, PUT, or PATCH requests that send JSON data from the client to the server
app.use(express.json());

app.use(cookieParser());

app.use("/api/v1/auth", authRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.info("Server successfully running on port: " + port);
});
